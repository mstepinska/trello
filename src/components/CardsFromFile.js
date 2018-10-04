import React, { Component } from 'react'
import { FormGroup, Form, Input, Button, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { CSVtoArray } from '../utils/csv.js'
import { add_labels_to_board, fetch_board_info, add_cards_to_board } from '../utils/trello_api.js'
import { get_as_map } from '../utils/utils.js'
import TrelloCard from './TrelloCard.js'

import './CardsFromFile.css'


class CardsFromFile extends Component {
  constructor() {
    super()

    this.on_change_from_file_upload    = this.on_change_from_file_upload.bind(this)
    this.on_change_from_board_id_input = this.on_change_from_board_id_input.bind(this)
    this.lists_options                 = this.lists_options.bind(this)
    this.get_board_info                = this.get_board_info.bind(this)
    this.add_cards                     = this.add_cards.bind(this)
    this.parse_file                    = this.parse_file.bind(this)
    this.modal_toggle                  = this.modal_toggle.bind(this)
    this.list_option_change_handler    = this.list_option_change_handler.bind(this)

    this.state = {
      cards_from_file: null,
      lists: null,
      labels: null,
      board_id: 'tqdyKJ5q',
      list: null,
      modal_open: false
    }
  }

  modal_toggle() {
    const {modal_open} = this.state

    this.setState({modal_open: !modal_open})
  }

  on_change_from_board_id_input(e) {
    this.setState({board_id: e.target.value})
  }

  list_option_change_handler(e) {
    this.setState({list: e.target.value})
  }

  on_change_from_file_upload(e) {
    const files = e.target.files
    if (!files.length) {
      alert('No file select')
      return
    }
    const file = files[0]
    let reader = new FileReader()
    let that = this
    reader.onload = function(ev) {
      that.parse_file(ev.target.result)
    }
    reader.readAsText(file)
  }

  parse_file(content) {
    let filtered_content =  content.split('\n').filter((line) => !line.split(',').every(item => item.trim() === ''))

    const labels_line = filtered_content.shift()

    const labels = labels_line.split(',')

    const cards = filtered_content.map(item => {
      let card = {}
      const item_parts = CSVtoArray(item)
      labels.forEach((label, i) => {
        if (label.trim() !== '' ) {
          card = { ...card, [label]: item_parts[i] }
        }
      })

      return card
    })

    this.setState({cards_from_file: cards})
  }

  get_board_info() {
    const { board_id, cards_from_file } = this.state

    let labels_from_file = new Set()


    cards_from_file.forEach(card => {
      labels_from_file = [...labels_from_file, ...card.labels.split(',').map(item => (item.trim()))]
    })

    labels_from_file = [...new Set(labels_from_file)]

    fetch_board_info(board_id)
      .then(board_info => {
        const labels_from_board = Object.keys(get_as_map(board_info.labels, 'name'))

        const new_labels = labels_from_file.filter(label => !labels_from_board.includes(label))

        add_labels_to_board(new_labels, board_id)
          .then(response => {
            this.setState({
              lists: board_info.lists,
              labels: [...board_info.labels, ...response],
              list: board_info.lists[0].id
            })
          })

      })
  }

  lists_options() {
    const { lists } = this.state
    if (!lists) return null

    return lists.map((list, i) => (<option key={i} value={list.id}>{list.name}</option>))
  }

  add_cards() {
    const { cards_from_file, labels, list } = this.state
    const name_to_label = get_as_map(labels, 'name')


    const cards_to_add = cards_from_file.map(item => {
      const name = item.name || 'New card'
      const desc = item.desc || ''

      const label_ids = item.labels.split(',').map(label => (name_to_label[label.trim()].id))

      return {
        name,
        desc,
        label_ids
      }
    })

    debugger

    add_cards_to_board(cards_to_add, list)
      .then(response => {
      })
  }

  render() {
    const { list, cards_from_file, modal_open } = this.state

    const lists_options = this.lists_options()

    return (
      <div className='my-3'>
        <Modal isOpen={modal_open} toggle={this.modal_toggle} size='lg'>
          <ModalHeader>
            Cards to add
          </ModalHeader>
          <ModalBody>
            <div className='d-flex flex-wrap'>
            {cards_from_file &&
              cards_from_file.map((card, i) => (<div key={i} className='my-1 mr-1'><TrelloCard card={card}/></div>) )
            }
            </div>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>


        <FormGroup>
          <Input type="file" name="file" id="exampleFile" onChange={this.on_change_from_file_upload}  />
        </FormGroup>


        {cards_from_file &&
          <div>

            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input
                  onChange={this.on_change_from_board_id_input}
                  placeholder='Enter board id'
                />
                <Button color='primary' onClick={this.get_board_info} className='ml-3'>Get board info</Button>
                <Button onClick={this.modal_toggle} className='ml-3'>Show new cards</Button>
              </FormGroup>
            </Form>

            {lists_options &&
              <div className='mt-3'>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">List</InputGroupAddon>
                  <Input type='select' selected={list} onChange={this.list_option_change_handler}>
                    {lists_options}
                  </Input>
                  <InputGroupAddon addonType='append'><Button onClick={this.add_cards}>Add cards</Button></InputGroupAddon>
                </InputGroup>
              </div>
            }

          </div>
        }

      </div>
    )
  }
}

export default CardsFromFile
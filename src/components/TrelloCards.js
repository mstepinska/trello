import React, { Component } from 'react'
import saveAs from 'file-saver'

import { Input, Button, Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {fetch_board_cards} from '../utils/trello_api.js'
import TrelloCard from './TrelloCard.js'
import { get_csv_string } from '../utils/csv.js'

class TrelloCards extends Component {

  constructor() {
    super()

    this.on_change_from_board_id_input = this.on_change_from_board_id_input.bind(this)
    this.get_data                      = this.get_data.bind(this)
    this.export_data_as_csv            = this.export_data_as_csv.bind(this)
    this.modal_toggle                  = this.modal_toggle.bind(this)
    this.lists_options                 = this.lists_options.bind(this)
    this.list_option_change_handler    = this.list_option_change_handler.bind(this)

    this.state = {
      board_id: 'Z2APdYXS',
      trello_board_data: null,
      modal_open: false,
      list_option: 'all'
    }

  }

  on_change_from_board_id_input(e) {
    this.setState({board_id: e.target.value})
  }

  get_data() {
    fetch_board_cards(this.state.board_id)
      .then(response => {
        this.setState({trello_board_data: response})
      })
  }

  modal_toggle() {
    const { modal_open } = this.state

    this.setState({modal_open: !modal_open})
  }

  filter_cards_by_list(cards, list) {
    if (list === 'all') return cards

    return cards.filter(card => (card.idList === list))
  }

  export_data_as_csv() {
    const { trello_board_data, list_option } = this.state
    if (!trello_board_data) return null

    const cards = this.filter_cards_by_list(trello_board_data.cards, list_option)

    const data_rows = cards.map(card => {
      return [card.name, card.list, card.labels.map(label => (label.name)).join('|')]
    })
    const rows = [
      ['Name', 'List', 'Labels'],
      ...data_rows
    ]
    const csv_string = get_csv_string(rows)
    const blob = new Blob([csv_string], {type: 'application/json;charset=utf-8'})
    saveAs(blob, 'cards.csv')
  }

  cards() {
    const { trello_board_data } = this.state
    if (!trello_board_data) return null
    return trello_board_data.cards.map((card,i) => (<div key={i} className='my-1 mr-1'><TrelloCard card={card} /></div>))
  }

  lists_options() {
    const { trello_board_data } = this.state
    if (!trello_board_data) return null

    return trello_board_data.lists.map((list, i) => (<option key={i} value={list.id}>{list.name}</option>))
  }

  list_option_change_handler(e) {
    this.setState({list_option: e.target.value})
  }

  render() {
    const { trello_board_data, modal_open, list_option } = this.state
    const cards = this.cards()
    const lists_options = this.lists_options()

    return (
      <div className='my-3'>

        <Modal isOpen={modal_open} toggle={this.modal_toggle}>
          <ModalHeader>Select list to export</ModalHeader>
          <ModalBody>
            <Input type='select' onChange={this.list_option_change_handler} selected={list_option}>
              <option value='all'>All</option>
              {lists_options}
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.export_data_as_csv}>Export to csv</Button>
          </ModalFooter>
        </Modal>

        <div className='mb-3'>
          <Form inline>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Input
                onChange={this.on_change_from_board_id_input}
                placeholder='Enter board id'
              />
              <Button color='primary' onClick={this.get_data} className='ml-3'>Get cards</Button>
              <Button disabled={trello_board_data === null} onClick={this.modal_toggle} className='ml-1'>Export cards</Button>
            </FormGroup>
          </Form>
        </div>
        <div className='d-flex flex-wrap'>
          {cards}
        </div>

      </div>
    )
  }
}

export default TrelloCards
import React, { Component } from 'react'
import { FormGroup, Input, Button, Form } from 'reactstrap'

import { fetch_board_info, add_label_to_cards_on_list } from '../utils/trello_api.js'

class UpdateCards extends Component {
  constructor() {
    super()

    this.on_change_from_board_id_input = this.on_change_from_board_id_input.bind(this)
    this.list_option_change_handler    = this.list_option_change_handler.bind(this)
    this.label_option_change_handler   = this.label_option_change_handler.bind(this)
    this.get_board_info                = this.get_board_info.bind(this)
    this.update_with_label             = this.update_with_label.bind(this)

    this.state = {
      lists: null,
      labels: null,
      board_id: 'tqdyKJ5q',
      list: null,
      label: null
    }
  }

  list_option_change_handler(e) {
    this.setState({list: e.target.value})
  }

  label_option_change_handler(e) {
    this.setState({label: e.target.value})
  }

  on_change_from_board_id_input(e) {
    this.setState({board_id: e.target.value})
  }

  get_board_info() {
    const { board_id } = this.state

    fetch_board_info(board_id)
      .then(board_info => {
        this.setState({
          lists: board_info.lists,
          labels: board_info.labels,
          list: board_info.lists[0].id
        })
      })
  }

  lists_options() {
    const { lists } = this.state
    if (!lists) return null

    return lists.map((list, i) => (<option key={i} value={list.id}>{list.name}</option>))
  }

  labels_options() {
    const { labels } = this.state
    if (!labels) return null

    return labels.map((label, i) => (<option key={i} value={label.id}>{label.name}</option>))
  }

  update_with_label() {
    const {list, label} = this.state

    add_label_to_cards_on_list(list, label)
      .then(response => {
        debugger
      })
  }

  render() {
    const { list, label } = this.state
    const lists_options = this.lists_options()
    const labels_options = this.labels_options()

    return (
      <div className='my-3'>
        <Form inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Input
              onChange={this.on_change_from_board_id_input}
              placeholder='Enter board id'
            />
            <Button color='primary' onClick={this.get_board_info} className='ml-sm-3 mt-3 mt-sm-0'>Get board info</Button>
          </FormGroup>
        </Form>

        {lists_options &&
          <div className='mt-3'>
            <Input type='select' selected={list} onChange={this.list_option_change_handler}>
              <option>(select list)</option>
              {lists_options}
            </Input>
          </div>
        }

        {labels_options &&
          <div className='mt-3'>
            <Input type='select' selected={label} onChange={this.label_option_change_handler}>
              <option>(select label)</option>
              {labels_options}
            </Input>
          </div>
        }

        {list && label &&
          <div className='mt-3'>
            <Button color='primary' onClick={this.update_with_label}>Add selected label</Button>
          </div>
        }

      </div>
    )
  }
}

export default UpdateCards
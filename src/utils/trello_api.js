import axios from 'axios'
import _ from 'underscore'

import { TRELLO_API_URL, CARD_FIELDS } from '../constants/constants.js'
import { get_as_map } from './utils.js'

function get_board_url(board_id) {
  return `${TRELLO_API_URL}/boards/${board_id}`
}

function get_list_url(list_id) {
  return `${TRELLO_API_URL}/lists/${list_id}`
}

function get_card_url(card_id) {
  return `${TRELLO_API_URL}/card/${card_id}`
}

function get_credentials() {
  const key = process.env.REACT_APP_TRELLO_KEY
  const token = process.env.REACT_APP_TRELLO_TOKEN

  return `key=${key}&token=${token}`
}

export function fetch_board_lists(board_id) {
  const url = get_board_url(board_id) + `/lists/?${get_credentials()}`
  return axios.get(url)
}

export function fetch_board_members(board_id) {
  const url = get_board_url(board_id) + `/members/?${get_credentials()}`

  return axios.get(url)
}

export function fetch_board_labels(board_id) {
  const url = get_board_url(board_id) + `/labels/?${get_credentials()}`
  return axios.get(url)
}

export function fetch_board_info(board_id) {
  return axios.all([fetch_board_lists(board_id), fetch_board_members(board_id), fetch_board_labels(board_id)])
    .then(([lists_response, members_response, labels_response]) => {
      return {
        'lists': lists_response.data,
        'members': members_response.data,
        'labels': labels_response.data
      }
    })
}

export function fetch_board_cards(board_id) {
  return fetch_board_info(board_id)
    .then(board_info => {
      const url = get_board_url(board_id) + `/cards/?${get_credentials()}&fields=${CARD_FIELDS}`
      return axios.get(url).then(response => {

        const board_lists = get_as_map(board_info.lists, 'id')
        const board_members = get_as_map(board_info.members, 'id')

        const cards = response.data

        const processed_data = cards.map(card => (
          {...card, list: board_lists[card.idList].name, members: card.idMembers.map(member => (board_members[member].fullName))}
        ))

        return {
          ...board_info,
          cards: processed_data
        }
      })
  })
}

export function fetch_list_cards(list_id) {
  const url = `${get_list_url(list_id)}/cards?${get_credentials()}`
  return axios.get(url)
}

function post(url) {
  return axios.post(url)
}

export function add_labels_to_board(labels, board_id) {
  const COLOURS = ['yellow', 'purple', 'blue', 'green', 'orange', 'sky', 'pink', 'lime']

  const promises = labels.map(label => {
    return post(get_board_url(board_id) + `/labels?${get_credentials()}&name=${label}&color=${_.sample(COLOURS)}`)
  })

  return axios.all(promises)
    .then(response => {
      return response.map(item => (item.data))
    })
}

export function add_cards_to_board(cards, list_id) {
  const promises = cards.map(card => {
    const url = `${TRELLO_API_URL}/cards?${get_credentials()}&idList=${list_id}&name=${encodeURIComponent(card.name)}&desc=${encodeURIComponent(card.desc)}&idLabels=${card.label_ids.join(',')}`

    return post(url)
  })

  return axios.all(promises)
    .then(response => {
      return response.map(item => (item.data))
    })
}

export function add_label_to_cards_on_list(list_id, label_id) {

  return fetch_list_cards(list_id)
    .then(response => {

      const cards = response.data

      const promises = cards.map(card => {
        const url = `${get_card_url(card.id)}/idLabels?${get_credentials()}&value=${label_id}`
        return post(url)
      })

      return axios.all(promises)
        .then(response => {
          return response.map(item => (item.data))
        })

    })
}
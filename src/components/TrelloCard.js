import React, { Component } from 'react'
import { Card } from 'reactstrap'

class TrelloCard extends Component {
  render() {
    const { card } = this.props
    const { list='', members=[], name, shortUrl, labels=[] } = card

    const labels_to_display = Array.isArray(labels) ? labels.map(label => (label.name)).join(', ') : labels

    return (
      <Card className='p-1'>
        <div>
          {shortUrl &&
            <a target='_blank' rel='noopener noreferrer' href={shortUrl}>{name}</a>
          }
          {!shortUrl && name}
        </div>
        <div>List: {list}</div>
        <div>Labels: {labels_to_display}</div>
        <div>Owners: {members.join(', ')}</div>
      </Card>
    )
  }
}

export default TrelloCard
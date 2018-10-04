import React, { Component } from 'react'

import { Card, CardBody } from 'reactstrap'

class Dashboard extends Component{
  render() {
    return (
      <div className='d-flex flex-wrap'>
        <Card inverse className='m-3'>
          <CardBody>
            <a role='button' href='/export'>Export</a>
          </CardBody>
        </Card>
        <Card inverse className='m-3'>
          <CardBody>
            <a href='/import'>Import</a>
          </CardBody>
        </Card>
        <Card inverse className='m-3'>
          <CardBody>
            <a href='/update'>Update</a>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Dashboard
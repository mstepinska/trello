import React, { Component } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import {Container, Navbar, NavbarBrand} from 'reactstrap'

import Routes from './Routes.js'

import './App.css'

class App extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Navbar color="light" light expand="md">
            <NavbarBrand href='/'>Home</NavbarBrand>
          </Navbar>
        </Container>
        <Container>
          <Router>
            <Routes/>
          </Router>
        </Container>
      </div>
    )
  }
}

export default App

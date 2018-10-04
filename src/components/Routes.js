import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import TrelloCards from './TrelloCards.js'
import Dashboard from './Dashboard.js'
import CardsFromFile from './CardsFromFile.js'
import UpdateCards from './UpdateCards.js'

const ROUTES = [
  { path: '/dashboard', title: 'Trello cards', main: Dashboard },
  { path: '/export', title: 'Export cards', main: TrelloCards },
  { path: '/import', title: 'Import cards', main: CardsFromFile },
  { path: '/update', title: 'Update cards', main: UpdateCards }
]

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={() => (<Redirect to='/dashboard'/>)}/>
        {ROUTES.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        ))}
        <Route render={({ location }) => (<Dashboard/>) } />
      </Switch>
    )
  }
}

export default Routes
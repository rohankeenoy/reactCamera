import React from 'react'
import ReactDOM from 'react-dom'
import Scanpage from './containers/Scanpage'
import RecyclingPage from './containers/RecyclingPage'
import Welcome from './containers/Welcome'
import SignUp from './containers/SignUp'
import Login from './containers/Login'
import HomePage from './containers/HomePage'
import trip from './containers/trip'
import {BrowserRouter, Route,Link} from 'react-router-dom'

const AppContainer = () => {
  return (
    <BrowserRouter>
      <Route component={Welcome} exact path='/' />
      <Route component={SignUp} exact path = '/signup'/>
      <Route component={Login} exact path = '/login' />
      <Route component={Scanpage} exact path='/scan' />
      <Route component={trip} exact path='/trip' />
      <Route component={HomePage}  exact path = '/home'/>

    </BrowserRouter>
  )
}

ReactDOM.render(<AppContainer/>, document.querySelector('#root'))


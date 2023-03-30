import React from 'react'
import ReactDOM from 'react-dom'
import Scanpage from './containers/Scanpage'
import {BrowserRouter, Route} from 'react-router-dom'

// import material UI a



const AppContainer = () => {
  return (
  

    <BrowserRouter>
      
    {
    //  Without using exact, both pages come up due to string matching the first slash together. 
    }
      <Route component={Scanpage} exact path ='/' />
      
    </BrowserRouter>
    
  )
}
  ReactDOM.render(<AppContainer/>, document.querySelector('#root'))

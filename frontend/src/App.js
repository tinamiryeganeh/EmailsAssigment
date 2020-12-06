import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Login from './Login';
import EmailList from './EmailList';
import ResponsiveDrawer from './ResponsiveDrawer';

/**
 * Simple component with no state.
 *
 * @param {function} setDummy set the dummy state
 */
function getDummy(setDummy) {
  fetch('http://localhost:3010/v0/dummy')
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setDummy(json.message);
      })
      .catch((error) => {
        setDummy(error.toString());
      });
}

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const [dummy, setDummy] = React.useState('');
  return (
   <Router>
     <Switch>
          <Route exact path="/">
           <ResponsiveDrawer />
          </Route>
          <Route path="/login">
           <Login></Login>
          </Route>
        </Switch>
   </Router>
  );
}



export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import classes from './App.css';

import AppRoute from './App.route';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <AppRoute />
      </div>
    );
  }
}

export default App;

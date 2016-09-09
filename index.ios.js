/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var Login = require('./login.js');

class GithubBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};
    this.onLogin = this.onLogin.bind(this); // <- binding to this is necessary in ES6
    console.log(this.state);
  }

  render() {
    var msg = 'Welcome to Github Browser.';
    if(this.state.isLoggedIn){      
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Logged in</Text>
        </View>
        )
    }
    else{
      return (
        <Login onLogin={this.onLogin} />
      );
    }

  }

  onLogin() {
    this.setState({isLoggedIn: true});
  }

  // getInitialState() {
  //   console.log('isLoggedIn false');
  //   return {
  //     isLoggedIn: false
  //   }
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GithubBrowser', () => GithubBrowser);

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
  View,
  ActivityIndicator
} from 'react-native';

var Login = require('./login.js');
var AuthService = require('./AuthService');
var AppContainer = require('./AppContainer');

class GithubBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      checkingAuth: true };

    this.onLogin = this.onLogin.bind(this); // <- binding to this is necessary in ES6
    console.log(this.state);
  }

  componentDidMount() {
     AuthService.getAuthInfo((err, authInfo)=> {
      //console.log('componentDidMount, authInfo: ', authInfo);
      this.setState({
        checkingAuth: false,
        isLoggedIn: authInfo != null
      })
    }); 
  }

  render() {
    if(this.state.checkingAuth){
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            size='large'
            style={styles.loader} />
        </View>
        )
    }
    if(this.state.isLoggedIn){      
      return (
        <AppContainer/>
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

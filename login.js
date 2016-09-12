'use strict';

// import React, { Component } from 'react';
// var React = require('react-native');
var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  ActivityIndicator
} = ReactNative;

//var Text = React.Text;
class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showProgress: false
		}
	}
	render() {

		var errorCtrl = <View />;

		if(!this.state.success && this.state.badCredentials){
			errorCtrl = <Text style={styles.error}>
				That username and password did not work
			</Text>;
		}
		if(!this.state.success && this.state.unknownError){
			errorCtrl = <Text style={styles.error}>
				We had an unexpected issue
			</Text>;
		}

		return (
			<View style={styles.container}>
				<Image style={styles.logo} source={require('image!Octocat')}/>
				<Text style={styles.heading}>Github Browser</Text>
				<TextInput style={styles.input} 
					placeholder='Github username' 
					autoCorrect={false}
					onChangeText={(text)=> {
						this.setState({username: text.trim()}); 
						} 
					}
					oonFocus={() => {console.log('focus');}}
					// returnKeyType='go'
					onSubmitEditing={(event) => { 
				    	this.refs.Password.focus(); 
				  	}}
				  	// managed to hack it to get a TAB to take you to password field, only catch is the tab appears in the field
				  	// though I can strip it later.
				  	onKeyPress={(event) => {
				  		if(event.nativeEvent.key=='Tab') {
				  			// a pause was required or else the username field was being emptied on screen?
				  			setTimeout(() => {this.refs.Password.focus()}, 100); 
				  		}
				  	}}
				/>
				<TextInput ref='Password' 
					style={styles.input} 
					placeholder='Github password' 
					autoCorrect={false} 
					secureTextEntry={true} 
					onChangeText={(text)=> this.setState({password: text})} 
					onKeyPress={(event) => {
				  		console.log('username: '+this.state.username);
				  	}}
			  	/>
				
				{/*   Weird thing: if you use secureTextEntry='true' it works but complains it should be boolean.
						  React expects booleans to be surrounded by braces like above.

						  Also note you must wrap comments in these JSX sections as a tag, like this */ }
				<TouchableHighlight	onPress={this.onLoginPressed.bind(this)} style={styles.button}>
					<Text style={styles.buttonText}>
						Log in
					</Text>
				</TouchableHighlight>

				{errorCtrl}

				<ActivityIndicator animating={this.state.showProgress} size='large' style={styles.loader}/>	  
			</View>
			);
	}
	focusPassword(){
		setTimeout(() => {this.refs.Password.focus()}, 100); 
	}
	keyPress(event){
		console.log(event.nativeEvent.key);
	}

	onLoginPressed(){
		console.log('Attempting to login with username: '+this.state.username);
		this.setState({showProgress: true});
		var authService = require('./AuthService');
		authService.login({
			username: this.state.username,
			password: this.state.password
		}, (results) => {
			// this.setState(results);
			// this.setState({showProgress: false});			
			this.setState(Object.assign({
				showProgress: false
			}, results));

			if(results.success && this.props.onLogin){
				console.log('onLogin');
				this.props.onLogin();
			}
		})
	}
}

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#F5FCFF',
		flex: 1,
		paddingTop: 40,
		padding: 10,
		alignItems: 'center'
	},
	logo: {
		width: 66,
		height: 55
	},
	heading: {
		fontSize: 30,
		marginTop: 10
	},
	input: {
		height: 50,
		marginTop: 10,
		padding: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48bbec'
	},
	button: {
		height: 50,
		backgroundColor: '#48bbec',
		alignSelf: 'stretch',
		marginTop: 10,
		justifyContent: 'center'
	},
	buttonText: {
		fontSize: 22,
		color: '#FFF',
		alignSelf: 'center'
	},
	loader: {
		marginTop: 20
	},
	error: {
		color: 'red',
		paddingTop: 10,
	}
})
// 	({
// 	render: function(){
// 		return (
// 			<Text>Hello</Text>
// 			);
// 	}
// });

module.exports = Login;
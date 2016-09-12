var buffer = require('buffer');
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');

const authKey = 'auth';
const userKey = 'user';

class AuthService {
	getAuthInfo(callback){
		AsyncStorage.multiGet([authKey, userKey], (err, val) => {		
			if(err)
				return callback(err);
			if(!val)
				return callback();

			var authValue = val[0][1];
			var userValue = val[1][1];

			// why can I not get the values using the zipObject approach as shown in the demo?
			// var zippedObj = _.zipObject(val);
			//console.log(zippedObj);
			//console.log(zippedObj[authKey]);  <- this is undefined?

			if(!authValue)//!zippedObj[authKey])
				return callback();
			console.log('foo');
			
			var authInfo = {
				header: {
					Authorization: 'Basic ' + authValue //zippedObj[authKey]
				},
				user: JSON.parse(userValue)//zippedObj[userKey])
			}
			console.log(authInfo);
			return callback(null, authInfo);
		})
	}

	login(creds, callback){
		var b = new buffer.Buffer(creds.username +':'+ creds.password);
		var encodedAuth = b.toString('base64');

		fetch('https://api.github.com/user', {
			headers: {
				'Authorization' : 'Basic '+encodedAuth
			}
		}) // https://api.github.com/search/repositories?q=react')
		.then((response)=>{
			if(response.status >= 200 && response.status < 300)
				return response;
			throw {
				badCredentials: response.status == 401,
				unknownError: response.status != 401
			}
		})
		.then((response)=>{
			return response.json();
		})
		.then((results)=>{
			console.log(JSON.stringify(results));
			AsyncStorage.multiSet([
				[authKey, encodedAuth],
				['TEMPKEY', 'FOOBAR'],
				[userKey, JSON.stringify(results)]
				], (err) => {
					if(err)
						throw err;
					return callback({success: true});
				})
			// AsyncStorage.setItem(
			// 	authKey, encodedAuth,
			// 	 (err) => {
			// 		if(err)
			// 			throw err;
			// 		return callback({success: true});
			// 	});
			// AsyncStorage.setItem(
			// 	userKey, JSON.stringify(results),
			// 	 (err) => {
			// 		if(err)
			// 			throw err;
			// 		return callback({success: true});
			// 	});
			// AsyncStorage.setItem(
			// 	'TEMPKEY', 'FOOBAR2',
			// 	 (err) => {
			// 		if(err)
			// 			throw err;
			// 		return callback({success: true});
			// 	});


		})
		.catch((err)=> {
			return callback(err)
		})
		// .finally(()=> {
		// 	this.setState({showProgress: false});			
		// })
	}
}

module.exports = new AuthService();
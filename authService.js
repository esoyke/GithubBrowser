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

			var zippedObj = _.fromPairs(val);
			console.log(zippedObj);

			if(!zippedObj[authKey])  // authValue
				return callback();
			
			var authInfo = {
				header: {
					Authorization: 'Basic ' + zippedObj[authKey]  // authValue
				},
				user: JSON.parse(zippedObj[userKey])  // userValue)
			}
			//console.log(authInfo);
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
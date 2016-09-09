var buffer = require('buffer');

class AuthService {
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
			console.log('success')
			return callback({success: true});
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
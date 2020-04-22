const axios = require('axios');
const yargs = require('yargs').argv;
const responseDifference = require('./helpers/responseDifference');

const transformKeys = {

}

const register = async (server, options) => {
	server.route({
		method: '*',
		path: '/{p}',
		handler: async request => {
			try {
				const { headers: { ignored_keys = '', ...restOfHeaders }, method, query, path, payload } = request;
				const body = { ...payload };
				const localOptions = axios({
					baseURL: 'http://localhost:3000',
					method,
					url: path,
					data: body,
					responseType: 'json',
					headers: {
						'Content-Type': 'application/json',
						...(restOfHeaders[ 'internal-auth-token' ] ? { 'internal-auth-token': restOfHeaders[ 'internal-auth-token' ] } : {})
					}
				});

				const remoteOptions = axios({
					baseURL: yargs.remoteURL,
					method,
					url: path,
					data: body,
					responseType: 'json'
				});

				await axios.all([ localOptions, remoteOptions ]).then(axios.spread(([ local, remote ]) => {
					// const evolvedLocal;
					// const evolvedRemote;
					return {
						comparison: responseDifference(local, remote),
						local,
						remote
					}
				})).catch(error => {
					console.log(error);
				});
				return 'hello world';

			} catch (e) {
				console.log(e);
				return e;
			}
		}
	});
}

module.exports.plugin = {
	name: 'test',
	register
}
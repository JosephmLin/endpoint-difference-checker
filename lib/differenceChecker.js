const R = require('ramda');
const axios = require('axios');
const yargs = require('yargs').argv;

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
						// ...body(restOfHeaders[ 'internal-auth-token' ] ? { 'internal-auth-token': restOfHeaders[ 'internal-auth-token' ] } : {})
					}
				});
				console.log(yargs.remoteURL);
				const remoteOptions = axios({
					baseURL: yargs.remoteURL,
					method,
					url: path,
					data: body,
					responseType: 'json'
				});

				await axios.all([ localOptions, remoteOptions ]).then(axios.spread(([ local, remote ]) => {
					console.log(local);
					console.log(remote);
				})).catch(error => {
					console.log(error);
				});
				// console.log(localResponse);
				// console.log(remoteResponse);
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
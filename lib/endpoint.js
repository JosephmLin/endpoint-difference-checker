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
				const { headers: { ignored_keys = '', ...restOfHeaders }, method, params, path, payload } = request;
				const body = { ...payload };
				const localOptions = axios({
					baseURL: 'http://localhost:3000',
					method,
					url: path,
					params,
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
				const evolver = ignored_keys.split(',')
					.map(R.split('.'))
					.reduce(
						(accum, curr) => R.assocPath(curr, R.always('ignore'), accum),
						{}
					);
				await axios.all([ localOptions, remoteOptions ]).then(axios.spread(([ local, remote ]) => {
					const evolvedLocal = R.map(evolver, local);
					const evolvedRemote = R.map(evolver, remote);
					return {
						comparison: responseDifference(evolvedLocal, evolvedRemote),
						local,
						remote
					};
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
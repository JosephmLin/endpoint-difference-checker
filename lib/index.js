const Hapi = require('@hapi/hapi');
const yargs = require('yargs').argv;
const isURL = require('./helpers/isURL');

module.exports = async () => {
	if (!isURL(yargs.remoteURL)) {
		throw new Error('remoteURL argument is not a valid URL');
	}
	const server = Hapi.server({
		port: 3001,
		host: 'localhost'
	});
	await server.register(require('./endpoint'));
	await server.start();

	console.log(`Server listening: ${server.info.uri}`);

	return server;
}
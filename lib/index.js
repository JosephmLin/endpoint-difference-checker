const Hapi = require('@hapi/hapi');
module.exports = async () => {
	const server = Hapi.server({
		port: 3001,
		host: 'localhost'
	});
	await server.register(require('./differenceChecker'));
	await server.start();

	console.log(`Server listening: ${server.info.uri}`);

	return server;
}
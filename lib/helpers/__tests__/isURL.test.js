const isURL = require('../isURL');

describe('helpers/isURL', () => {
	test('should validate valid URL', () => {
		expect(isURL('www.google.com')).toEqual(true);
	});
	test('should invalidate invalid URL', () => {
		expect(isURL('')).toEqual(false);
	});
	test('should invalidate null object', () => {
		expect(isURL(null)).toEqual(false);
	});
})
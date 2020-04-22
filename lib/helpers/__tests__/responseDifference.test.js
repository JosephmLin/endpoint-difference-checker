const diff = require('../responseDifference');

describe('helpers/responseDifference', () => {
	test('should produce a deep object with two keys: same and differences', () => {
		expect(diff({ a: 2, b: 1 }, { a: 1, b: 1, c: { d: 'efg' } })).toEqual({
			different: {
				a: {
					localValue: 2,
					remoteValue: 1
				},
				c: {
					d: {
						localValue: 'No local value',
						remoteValue: 'efg'
					}
				}
			},
			same: {
				b: 1
			}

		});
	});

	test('should produce a deep object with two keys: same and differences', () => {
		expect(diff({ a: 2, b: 1, e: '098p' }, { a: 1, b: 1, c: { d: 'efg' } })).toEqual({
			different: {
				a: {
					localValue: 2,
					remoteValue: 1
				},
				c: {
					d: {
						localValue: 'No local value',
						remoteValue: 'efg'
					}
				}
			},
			same: {
				b: 1
			}

		});
	})
})
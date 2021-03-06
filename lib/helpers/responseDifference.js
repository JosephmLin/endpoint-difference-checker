const R = require('ramda');

const difference = local => currentPath => (accum, [ key, remoteValue ]) => {
	const newPath = R.append(key, currentPath);
	const localValue = R.prop(newPath, local);

	if (R.equals(key, 'ignore')) {
		return accum;
	}
	// If they are equal, or ignored, add it to the accumulator
	if (R.equals(localValue, remoteValue)) {
		return R.assocPath(
			[ 'same', ...newPath ],
			localValue,
			accum
		);
	}

	// If this is an non empty Object, Call difference again on all of the keys
	if (R.is(Object, remoteValue) && !R.isEmpty(remoteValue)) {
		return R.mergeDeepLeft(
			accum,
			R.reduce(
				difference(local)(newPath),
				accum,
				R.toPairs(remoteValue)
			)
		);
	}

	//these don't match, so change the value to show the two differences
	return R.assocPath(
		[ 'different', ...newPath ],
		{
			localValue: localValue || 'No local value',
			remoteValue
		},
		accum
	);
}

// This currently has a bug: if there's a missing value inside of remote, but is in local, it wouldn't show up.
// This is currently fixed by just running both sides, and merging. Unfortunately, the run time for this is SAD.
// There might be a better solution, but we'll iterate on that later.
module.exports = (local, remote) => {
	return R.mergeDeepLeft(
		R.reduce(difference(local)([]), {}, R.toPairs(remote)),
		R.reduce(difference(remote)([]), {}, R.toPairs(local))
	);
}
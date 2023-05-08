const gameAnimationProperty = () => {
	const keyFrame = [
		{
			transform: 'rotate3d(0, 0, 0, 0) translateY(0)',
			opacity: 0,
			cursor: 'none',
		},
		{
			transform: 'rotate3d(7, 8, 5, 360deg) translateY(100vh)',
			opacity: 1,
			cursor: 'none',
		},
		{
			transform: 'rotate(90deg) translateX(0)',
			opacity: 0,
			cursor: 'none',
		},
	];

	const timing = () => {
		return {
			duration: Math.floor(Math.random() * 2000 + 1500),
			iterations: 1,
		};
	};

	return {
		keyFrame,
		timing,
	};
};

export default gameAnimationProperty;

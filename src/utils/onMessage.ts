interface message {
	[key: string]: string;
}

const onMessage = (result: string = 'none', player?: string) => {
	const shiftOf = document.getElementById('shift_of') as HTMLSpanElement;

	const message: message = {
		winner: `Player ${player} is the winner!`,
		tie: 'Is Tie',
		none: `Player ${player}`,
	};
	shiftOf.textContent = message[result];
};

export default onMessage;

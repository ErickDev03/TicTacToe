class Game {
	#board = [];
	#player = 'X';
	#theWinner = null;
	#isTie = false;

	DrawSquares() {
		const wrapperSquares = document.querySelector('.wrapper-squares');
		const templatesSquares = (id) => `
      <div class="square" value="${id}">
        <span class="placeholder"></span>
        <span class="mark"></span>
      </div>
    `;
		for (let square = 0; square < 9; square++) {
			wrapperSquares.innerHTML += templatesSquares(square);
		}
	}

	CrossOutBoard() {
		const squares = document.querySelectorAll('.square');
		const spanSquares = document.querySelectorAll('.square .mark');
		const shiftOf = document.getElementById('shift_of');

		let counterAllSquare = 0;

		squares.forEach((square, i) => {
			square.addEventListener('click', (e) => {
				const { value } = square.attributes.value;
				counterAllSquare += i;
				if (this.#board[~~value]) return;
				spanSquares[~~value].textContent = this.#player;
				this.#board[~~value] = this.#player;

				this.#player = this.#player === 'X' ? 'O' : 'X';
				shiftOf.textContent = `Player ${this.#player}`;``

				if (this.Winner()) {
					this.#theWinner = this.Winner();
					this.NewGame();
					this.Scores();
					shiftOf.textContent = `Player ${this.#theWinner} is the Winner!`;
				}

				this.#isTie = counterAllSquare === 36;

				if (this.#isTie) {
					this.NewGame();
					shiftOf.textContent = `Is Tie`;
				}
			});
		});
	}

	Winner() {
		const winningCombination = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < winningCombination.length; i++) {
			const [a, b, c] = winningCombination[i];

			if (
				this.#board[a] &&
				this.#board[a] === this.#board[b] &&
				this.#board[a] === this.#board[c]
			) {
				return this.#board[a];
			}
		}

		return null;
	}

	NewGame() {
		const squares = document.querySelectorAll('.square');
		const spanSquares = document.querySelectorAll('.square .mark');
		const { keyFrame, timing } = this.AnimateNewGame();

		if (this.#board.length <= 0) return;

		squares.forEach((square, i) => {
			square.animate(keyFrame, timing());
			spanSquares[i].textContent = '';
		});

		this.#board = [];
		this.#isTie = false;
	}

	AnimateNewGame() {
		const keyFrame = [
			{
				transform: 'rotate3d(7, 8, 1, 360deg) translateY(100vh)',
				opacity: 1,
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
	}

	Scores() {
		const playerO = document.getElementById('player_O');
		const playerX = document.getElementById('player_X');

		const { random, floor } = Math;
		const scores = floor(random() * 500 + 100);

		if (this.#theWinner === 'O') {
			playerO.textContent = `${scores}`;
			return;
		}

		playerX.textContent = `${scores}`;
	}

	ControlsGame() {
		const btnNewGame = document.getElementById('new_game');
		btnNewGame.addEventListener('click', () => this.NewGame());
	}

	Main() {
		this.DrawSquares();
		this.CrossOutBoard();
		this.ControlsGame();
	}

	Init() {
		this.Main();
	}
}

const game = new Game();
game.Init();

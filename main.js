class Game {
	#scoresO = 0;
	#scoresX = 0;
	#board = [];
	#theWinner = null;
	#player = 'X';
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
		let boardFull = 0;

		const handlerCrossOutBoard = (square) => {
			const { value } = square.attributes.value;

			const currentSquare = ~~value;

			boardFull += currentSquare;
			this.#isTie = boardFull === 36;

			if (this.#board[currentSquare]) return;

			spanSquares[currentSquare].textContent = this.#player;
			this.#board[currentSquare] = this.#player;

			this.#player = this.#player === 'X' ? 'O' : 'X';
			shiftOf.textContent = `Player ${this.#player}`;

			if (this.Winner()) {
				boardFull = 0;
				this.#theWinner = this.Winner();
				this.#player = this.#theWinner;
				this.Scores();
				this.NewGame();
				shiftOf.textContent = `Player ${this.#theWinner} is the Winner!`;
				return;
			}

			if (this.#isTie) {
				this.NewGame();
				shiftOf.textContent = `Is Tie`;
				boardFull = 0;
			}
		};

		squares.forEach((square) => {
			square.addEventListener('click', () => handlerCrossOutBoard(square));
			this.Placeholder(square);
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

	Placeholder(square) {
		const allPlaceholder = document.querySelectorAll('.placeholder');
		allPlaceholder.forEach((placeholder) => {
			square.addEventListener('mouseover', () => {
				if (square.children.item(1).textContent === '') {
					placeholder.textContent = this.#player;
					placeholder.classList.add('active');
					return;
				}
				placeholder.classList.remove('active');
			});
		});
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
	}

	Scores() {
		const playerO = document.getElementById('player_O');
		const playerX = document.getElementById('player_X');
		const generateScores = () => Math.floor(Math.random() * 500 + 100);

		this.#scoresX += this.#theWinner === 'X' ? generateScores() : 0;
		this.#scoresO += this.#theWinner === 'O' ? generateScores() : 0;

		playerO.textContent = `${this.#scoresO}`;
		playerX.textContent = `${this.#scoresX}`;
	}

	ControlsGame() {
		const btnNewGame = document.getElementById('new_game');
		btnNewGame.addEventListener('click', () => {
			this.#scoresO = 0;
			this.#scoresX = 0;
			this.NewGame();
		});
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

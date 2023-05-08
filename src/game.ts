import { resultOfWinner, onMessage } from './utils';
import gameAnimationProperty from './utils/gameAnimationProperty';

interface Game {
	scoresO: number;
	scoresX: number;
	boardFull: number;
	board: string[];
	currentPlayer: string;
}

interface HistoryStorage {
	player: string;
	position: number;
}

export default class GameTiTacToe implements Game {
	public scoresO: number = 0;
	public scoresX: number = 0;
	public boardFull: number = 0;
	public board: string[] = [];
	public currentPlayer: string = '';
	public historyStorage: HistoryStorage[] = [];

	constructor(currentPlayer: string) {
		this.currentPlayer = currentPlayer;
	}

	private DrawSquares(): void {
		const wrapperSquares = document.querySelector(
			'.wrapper-squares'
		) as HTMLDivElement;

		const template = (id: number): string => `
    <div class="square center" value=${id}>
      <span class="placeholder"></span>
      <span class="mark center"></span>
    </div>
    `;

		for (let square = 0; square < 9; square++) {
			wrapperSquares.innerHTML += template(square);
		}
	}

	private CrossOutBoard(): void {
		const squares = document.querySelectorAll('.square') as NodeList;
		const spanSquares = document.querySelectorAll('.square .mark') as NodeList;

		onMessage('none', this.currentPlayer);

		const handlerCrossOutBoard = (square: Element) => {
			const currentSquare = Number(square?.getAttribute('value'));
			this.boardFull += currentSquare;
			if (this.board[currentSquare]) return;

			spanSquares[currentSquare].textContent = this.currentPlayer;
			this.board[currentSquare] = this.currentPlayer;
			this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
			onMessage(this.currentPlayer);
			square.classList.add('marked');

			this.historyStorage = [
				...this.historyStorage,
				{
					player: this.board[currentSquare],
					position: currentSquare,
				},
			];
			// Update method
			this.Result();
			this.History();
		};

		squares.forEach((square) => {
			square.addEventListener('click', () =>
				handlerCrossOutBoard(square as Element)
			);
			this.Placeholder(square as Element);
		});
	}

	private Result(): void {
		if (
			resultOfWinner(this.board) &&
			typeof resultOfWinner(this.board) === 'string'
		) {
			this.currentPlayer = resultOfWinner(this.board) as string;
			onMessage('winner', this.currentPlayer);
			this.Scores();
			this.NewGame();
			return;
		}

		if (this.boardFull === 36) {
			onMessage('tie');
			this.NewGame();
			this.boardFull = 0;
			return;
		}
		onMessage('none', this.currentPlayer);
	}

	private Scores(): void {
		const playerO = document.getElementById('player_O') as HTMLSpanElement;
		const playerX = document.getElementById('player_X') as HTMLSpanElement;

		const generateScores = () => Math.floor(Math.random() * 500 + 100);

		this.scoresX += resultOfWinner(this.board) === 'X' ? generateScores() : 0;
		this.scoresO += resultOfWinner(this.board) === 'O' ? generateScores() : 0;

		playerO.textContent = `${this.scoresO}`;
		playerX.textContent = `${this.scoresX}`;
	}

	private Placeholder(square: Element): void {
		const allPlaceholder = document.querySelectorAll('.placeholder');
		allPlaceholder.forEach((placeholder) => {
			square.addEventListener('mouseover', () => {
				if (square.children[1].textContent === '') {
					placeholder.textContent = this.currentPlayer;
					placeholder.classList.add('active');
					return;
				}
				placeholder.classList.remove('active');
			});
			square.classList.remove('marked');
		});
	}

	private NewGame(): void {
		const squares = document.querySelectorAll(
			'.square'
		) as NodeListOf<HTMLDivElement>;
		const historyElems = document.getElementById(
			'history_elems'
		) as HTMLElement;

		const { keyFrame, timing } = gameAnimationProperty();

		squares.forEach((square: HTMLDivElement) => {
			square.animate(keyFrame, timing());
			square.children[0].textContent = '';
			square.children[1].textContent = '';
			square.classList.remove('marked');
		});
		this.board = [];
		this.boardFull = 0;
		this.historyStorage = [];
		this.History();

		historyElems.innerHTML = `
		<div class="history_elem primary between">
          <span>Player </span>
          <span>Move</span>
          <span>Action</span>
        </div>
    <span class="message">Empty history... 🥱</span>
		`;
		onMessage('none', this.currentPlayer);
	}

	History() {
		const btnOpenHistory = document.getElementById(
			'history'
		) as HTMLButtonElement;
		const btnCloseHistory = document.getElementById(
			'close_history'
		) as HTMLButtonElement;
		const historyCard = document.querySelector(
			'.game_history'
		) as HTMLDivElement;
		const message = document.querySelector('.message') as HTMLSpanElement;
		const historyElems = document.getElementById(
			'history_elems'
		) as HTMLElement;

		const templateHistoryElem = (elm: HistoryStorage) => {
			const { player, position } = elm;
			return `
			<div class="history_elem between">
						<span>${player}</span>
						<span>#${position}</span>
						<button>Go</button>
			</div>
		`;
		};

		message.style.display = this.historyStorage.length === 0 ? 'block' : 'none';

		for (let i = 0; i < this.historyStorage.length; i++) {
			historyElems.innerHTML += templateHistoryElem(
				this.historyStorage.splice(i)[i]
			);
		}

		btnOpenHistory.addEventListener('mouseover', () => {
			historyCard.classList.add('open_history');
		});
		btnCloseHistory.addEventListener('click', () => {
			historyCard.classList.remove('open_history');
		});
	}

	private ControlsGame() {
		const btnNewGame = document.getElementById('new_game') as HTMLButtonElement;
		btnNewGame.addEventListener('click', () => this.ResetGame());
	}

	private ResetGame() {
		const historyElems = document.getElementById(
			'history_elems'
		) as HTMLElement;

		historyElems.innerHTML = `
		<div class="history_elem primary between">
          <span>Player </span>
          <span>Move</span>
          <span>Action</span>
        </div>
    <span class="message">Empty history... 🥱</span>
		`;
		this.scoresO = 0;
		this.scoresX = 0;
		this.boardFull = 0;
		this.board = [];
		this.historyStorage = [];
		this.History();
		// this.currentPlayer = '';
		this.NewGame();
		this.Result();
		this.Scores();
	}

	public Init(): void {
		this.DrawSquares();
		this.CrossOutBoard();
		this.ControlsGame();
		this.History();
	}
}

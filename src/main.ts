import './css/style.css';
import GameTiTacToe from './game';

const game = new GameTiTacToe('O');
document.addEventListener('DOMContentLoaded', () => {
	game.Init();
});

import { ICON_X, ICON_O } from './icons.js';

export const initialState = {
  players: {
    player1: ICON_X, //ieliec saiti
    player2: ICON_O,
  },
  gameMode: '',
  turn: ICON_X,
  cells: ['', '', '', '', '', '', '', '', ''],
  gameOver: false,
  score: {
    player1Score: 0,
    player2Score: 0,
    ties: 0,
  }
}


export const initialState = {
  players: {
    player1: './assets/icon-x.svg', //ieliec saiti
    player2: './assets/icon-o.svg',
  },
  gameMode: '',
  turn: './assets/icon-x.svg',
  cells: ['', '', '', '', '', '', '', '', ''],
  gameOver: false,
  score: {
    player1Score: 0,
    player2Score: 0,
    ties: 0,
  }
}


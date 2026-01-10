import {state} from './game-state.js';

// speles iestatījumu izvēle
export function setupPlayerMark () {
  const markBtn = document.querySelectorAll('.mark-btn-js');
    console.log(state.players.player1)
  markBtn.forEach(button => { 
    button.addEventListener('click', () => {  
      const mark = button.dataset.mark;
      state.players.player1 = mark;
      state.players.player2 = mark === 'x' ? 'o' : 'x';
      console.log(mark)
      markBtn.forEach (btn => {
        if(btn === button) {
          btn.setAttribute('aria-selected', true);
        } else {
          btn.setAttribute('aria-selected', false);
        }
      });
      //console.log(mark)
    }); 
  });
}

// pāret no iestatījumiem uz spēli
export function setupGameMode () {
  const newGameBtn = document.querySelectorAll('.new-game-btn');
  const newGameMenu = document.querySelector('.new-game-js');
  const gameBoard = document.querySelector('.game-board-js');

  newGameBtn.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      state.gameMode = mode;
      newGameMenu.hidden = true;
      gameBoard.hidden = false;
    });
  });
}

export function gameStart () {
  if(state.players.player1 === 'x') {
    state.turn = state.players.player1;
  }

  if(state.players.player2 === 'x') {
    state.turn = state.players.player2;
  }

  return state.turn
}

// spēles cikla sākums
export function chooseGameBlock () {
  const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
    const scoreMe = document.querySelector('.score-me');
    const scorePlayer = document.querySelector('.score-player');
    const scoreTie = document.querySelector('.score-tie');
    
  gameBlock.forEach(block => {
    const cell = parseFloat(block.dataset.cell);
    
    whosTurn.innerHTML = state.turn;
    block.addEventListener('click', () => {
     console.log(block);
      console.log(state.turn)
      if (state.cells[cell] === '') {
        // state.cells[cell] = block;
        
        if (state.turn === state.players.player1) {
          const player1 = state.players.player1;
          state.cells[cell] = state.players.player1;
          block.innerHTML = state.players.player1;
          if (checkWinner(player1)) {
            setScore(state.score, 'player1Score', scoreMe);
          } else if (checkTie()) {
            setScore(state.score, 'ties', scoreTie);
          }
          state.turn = state.players.player2;
          whosTurn.innerHTML = state.turn;
        } else {
          const player2 = state.players.player2;
          state.cells[cell] = state.players.player2;
          block.innerHTML = state.players.player2;
          if (checkWinner(player2)) {
            setScore (state.score, 'player2Score', scorePlayer);
          } else if (checkTie()) {
            setScore(state.score, 'ties', scoreTie);
          }
          state.turn = state.players.player1;
          whosTurn.innerHTML = state.turn;
        }
        console.log(state.cells)
      } else {
        return
      }
    }) 
  })
}

function checkWinner (player) {
  const winnings = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];

  for (const w of winnings) {
    if ((state.cells[w[0]] === player && state.cells[w[1]] === player && state.cells[w[2]] === player) && (state.cells[w[0]] !== '' && state.cells[w[1]] !== '' && state.cells[w[2]] !== '')) {
      return true;
    };
  };
  return false; 
}

function checkTie () {
  for (let i = 0; i < state.cells.length; i++) {
    if (state.cells[i] === '') {
      return false;
    };
  };
  return true;
}

function setScore (score, key, elementForCode) {
    score[key] += 1;
    elementForCode.innerHTML = score[key];
}
import {initialState} from './game-state.js';
export const state = structuredClone(initialState);
// speles iestatījumu izvēle
export function setupPlayerMark () {
  const markBtn = document.querySelectorAll('.mark-btn-js');
    
  markBtn.forEach(button => { 
    button.addEventListener('click', () => {  
      const mark = button.dataset.mark;
      state.players.player1 = mark;
      state.players.player2 = mark === './assets/icon-x.svg' ? './assets/icon-o.svg' : './assets/icon-x.svg';
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
  if(state.players.player1 === './assets/icon-x.svg') {
    state.turn = state.players.player1;
  }

  if(state.players.player2 === './assets/icon-x.svg') {
    state.turn = state.players.player2;
  }

  return state.turn
}

// spēles cikla sākums
export function chooseGameBlock () {
  const gameBoardSection = document.querySelector('.game-board-section');
  const gameBoard = document.querySelectorAll('.game-board');
  const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
    const scoreMe = document.querySelector('.score-me');
    const scorePlayer = document.querySelector('.score-player');
    const scoreTie = document.querySelector('.score-tie');
    
  gameBlock.forEach(block => {
    const cell = parseFloat(block.dataset.cell);
    
    whosTurn.innerHTML = `<img src="${state.turn}" alt="${state.turn}">`
    block.addEventListener('click', () => {
      if (state.gameOver) return;

      console.log(block);
      console.log(state.turn)
      if (state.cells[cell] === '') {
        // state.cells[cell] = block;
        
        if (state.turn === state.players.player1) {
          const player1 = state.players.player1;
          state.cells[cell] = state.players.player1;
          block.innerHTML = `<img src="${state.players.player1}" alt="X">`;
          if (checkWinner(player1)) {
            setScore(state.score, 'player1Score', scoreMe);
            state.gameOver = true;
            // showOverlay('win', player1);
            setTimeout(() => showOverlay(player1), 1000);
          } else if (checkTie()) {
            setScore(state.score, 'ties', scoreTie);
            state.gameOver = true;
            // showOverlay('tie');
          }
          state.turn = state.players.player2;
          whosTurn.innerHTML = `<img src="${state.turn}" alt="${state.turn}">`;
        } else {
          const player2 = state.players.player2;
          state.cells[cell] = state.players.player2;
          block.innerHTML = `<img src="${state.players.player2}" alt="X">`;
          if (checkWinner(player2)) {
            setScore (state.score, 'player2Score', scorePlayer);
            state.gameOver = true;
            setTimeout(() => showOverlay(player2), 1000);
          } else if (checkTie()) {
            setScore(state.score, 'ties', scoreTie);
            state.gameOver = true;
          }
          state.turn = state.players.player1;
          whosTurn.innerHTML = `<img src="${state.turn}" alt="${state.turn}">`;
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

function showOverlay(player) {
  const overlaySection = document.querySelector('.overlay-container');
  const whoWon = document.querySelector('.who-won-info');
  const takesTheRound = document.querySelector('.takes-round-msg');

  overlaySection.hidden = false;
  if(state.players.player1 === player) {
    whoWon.innerHTML = 'You won!';
  } else {
    whoWon.innerHTML = 'Oh no, you lost...';
  } 
  

}

export function quitGame () {
  const quitBtn = document.querySelector('.quit-js-btn');
  const overlaySection = document.querySelector('.overlay-container');
  const newGameMenu = document.querySelector('.new-game-js');
  const gameBoard = document.querySelector('.game-board-js');

  quitBtn.addEventListener('click', () => {
    resetState();
    resetBoardUI();
    newGameMenu.hidden = false;
    gameBoard.hidden = true;
    overlaySection.hidden = true;
    // console.log(initialState)
    // console.log(state)
    
  })
}

function resetState() {
  const newState = structuredClone(initialState);
  Object.assign(state, newState);
}

function resetBoardUI() {
  const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
  const scoreMe = document.querySelector('.score-me');
    const scorePlayer = document.querySelector('.score-player');
    const scoreTie = document.querySelector('.score-tie');


  whosTurn.innerHTML = state.turn;
  gameBlock.forEach((block, i) => {
    block.innerHTML = state.cells[i];
  });
  scoreMe.innerHTML = state.score.player1Score;
  scorePlayer.innerHTML = state.score.player2Score;
  scoreTie.innerHTML = state.score.ties;
}
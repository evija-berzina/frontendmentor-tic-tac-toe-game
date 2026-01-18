import {initialState} from './game-state.js';
import { ICON_X, ICON_O } from './icons.js';

export const state = structuredClone(initialState);
// speles iestatījumu izvēle
export function setupPlayerMark () {
  const markBtn = document.querySelectorAll('.mark-btn-js');
    
  markBtn.forEach(button => { 
    button.addEventListener('click', () => {  
      const mark = button.dataset.mark;
      state.players.player1 = mark === 'x' ? ICON_X : ICON_O;
      state.players.player2 = mark === 'x' ? ICON_O : ICON_X;
      console.log(mark)
      

      state.turn = state.players.player1 === ICON_X
  ? state.players.player1
  : state.players.player2;

  console.log(state.turn)
      console.log(state.players.player2)

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
  const gameBoardBlocks = document.querySelector('.game-board-blocks');
  const whosTurn = document.querySelector('.whos-turn');
  const playerX = document.querySelector('.player-x');
  const playerO = document.querySelector('.player-o');

  newGameBtn.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      state.gameMode = mode;
      newGameMenu.hidden = true;
      gameBoard.hidden = false;

      if(state.gameMode === 'cpu' && state.turn === state.players.player2) {
        setTimeout(cpuMoveHandler, updateTurnClass, 1000);
      }

      updateTurnClass();
      whosTurn.innerHTML = state.turn;

      if(state.gameMode === 'cpu') {
        if (state.players.player1 === ICON_X) {
          playerX.textContent = '(YOU)';
          playerO.textContent = '(CPU)';
        } else {
          playerX.textContent = '(CPU)';
          playerO.textContent = '(YOU)';
        }
      } else if (state.gameMode === 'player') {
        if (state.players.player1 === ICON_X) {
          playerX.textContent = '(P1)';
          playerO.textContent = '(P2)';
        } else {
          playerX.textContent = '(P2)';
          playerO.textContent = '(P1)';
        }
      }
    });
  });
}

// spēles cikla sākums
export function chooseGameBlock () {
  const gameBoardSection = document.querySelector('.game-board-section');
  const gameBoardBlocks = document.querySelector('.game-board-blocks');
  const gameBoard = document.querySelectorAll('.game-board');
  const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
  const scoreMe = document.querySelector('.score-me');
  const scorePlayer = document.querySelector('.score-player');
  const scoreTie = document.querySelector('.score-tie');
    
  scoreMe.textContent = state.score.player1Score;
  scorePlayer.textContent = state.score.player2Score;
  scoreTie.textContent = state.score.ties; 

  

  gameBlock.forEach(block => {
    let cell = parseFloat(block.dataset.cell);
    block.addEventListener('click', () => {
      if (state.gameMode === 'cpu') {
        if (state.cells[cell] !== '' || state.gameOver) return;
        
        state.cells[cell] = state.players.player1;
        block.innerHTML = state.players.player1;
        block.classList.add('filled');

        if (checkWinner(state.players.player1)) {
          setScore(state.score, 'player1Score', scoreMe);
          state.gameOver = true;
          setTimeout(() => showOverlay('win', state.players.player1), 1000);
          return;
        }

        if (checkTie()) {
          setScore(state.score, 'ties', scoreTie);
          state.gameOver = true;
          setTimeout(() => showOverlay('tie'), 1000);
          return;
        }

        state.turn = state.players.player2;
        whosTurn.innerHTML = state.turn;
        updateTurnClass();

        if(state.gameMode === 'cpu') {
          setTimeout(cpuMoveHandler, 500);
        }
        
      } else if (state.gameMode === 'player') {
       
          if (state.gameOver) return;
          if (state.cells[cell] === '') {
          
            if (state.turn === state.players.player1) {
              const player1 = state.players.player1;
              state.cells[cell] = state.players.player1;
              block.innerHTML = state.players.player1;
              block.classList.add('filled');
              if (checkWinner(player1)) {
                setScore(state.score, 'player1Score', scoreMe);
                state.gameOver = true;
                // showOverlay('win', player1);
                setTimeout(() => showOverlay('win', player1), 1000);
              } else if (checkTie()) {
                setScore(state.score, 'ties', scoreTie);
                state.gameOver = true;
                setTimeout(() => showOverlay('tie'), 1000);
                // showOverlay('tie');
              }
              state.turn = state.players.player2;
              whosTurn.innerHTML = state.turn;
              updateTurnClass();
            } else {
              const player2 = state.players.player2;
              state.cells[cell] = state.players.player2;
              block.innerHTML = state.players.player2;
              block.classList.add('filled');
              if (checkWinner(player2)) {
                setScore (state.score, 'player2Score', scorePlayer);
                state.gameOver = true;
                setTimeout(() => showOverlay('win', player2), 1000);
              } else if (checkTie()) {
                setScore(state.score, 'ties', scoreTie);
                state.gameOver = true;
                setTimeout(() => showOverlay('tie'), 1000);
              }
              state.turn = state.players.player1;
              whosTurn.innerHTML = state.turn;
              updateTurnClass();
            }
          } else {
            return;
          }
      }
    });
  });
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

function showOverlay(position, player) {
  const overlaySection = document.querySelector('.overlay-container');
  const whoWon = document.querySelector('.who-won-info');
  const takesTheRound = document.querySelector('.takes-round-msg');
  const greyBtn = document.querySelector('.quit-js-btn');
  const yellowBtn = document.querySelector('.next-round-btn');

  // overlay default stāvoklis
  overlaySection.hidden = false;
  whoWon.hidden = false;
  whoWon.textContent = '';

  takesTheRound.textContent = '';

  greyBtn.textContent = '';
  yellowBtn.textContent = '';

  takesTheRound.classList.remove('x-turn', 'o-turn');

  //viens aktīvais režīms
  if(position === 'win') {
    greyBtn.textContent = 'quit';
    greyBtn.dataset.action = 'quit';
    yellowBtn.textContent = 'next round';
    yellowBtn.dataset.action = 'nextRound';

    const winner = player;

    takesTheRound.innerHTML = `${winner} takes the round`;
    takesTheRound.classList.remove('x-turn', 'o-turn');
    takesTheRound.classList.add(
      winner === ICON_X ? 'x-turn' : 'o-turn'
    );

    if (state.players.player1 === winner) {
      whoWon.textContent = 'You won!';
    } else {
      whoWon.textContent = 'Oh no, you lost...';
    }
  } else if(position === 'tie') {
    whoWon.hidden = true;
    takesTheRound.textContent = 'Round tied';
    greyBtn.textContent = 'quit';
    greyBtn.dataset.action = 'quit';
    yellowBtn.textContent = 'next round';
    yellowBtn.dataset.action = 'nextRound';
  } else if(position === 'reset') {
    whoWon.hidden = true;
    takesTheRound.textContent = 'Restart game?';
    greyBtn.textContent = 'no, cancel';
    greyBtn.dataset.action = 'cancel';
    yellowBtn.textContent = 'yes, restart'
    yellowBtn.dataset.action = 'restart';
  }
}

export function quitGame() {
  const quitBtn = document.querySelector('.quit-js-btn');
  const overlaySection = document.querySelector('.overlay-container');
  const newGameMenu = document.querySelector('.new-game-js');
  const gameBoard = document.querySelector('.game-board-js');

    resetState();
    resetBoardUI();
    newGameMenu.hidden = false;
    gameBoard.hidden = true;
    overlaySection.hidden = true;
    // console.log(initialState)
    // console.log(state)
    
}

function resetState() {
  const newState = structuredClone(initialState);
  Object.assign(state, newState);
}

function resetBoardUI() {
  const gameBlock = document.querySelectorAll('.game-board-block');
  const gameBoardBlocks = document.querySelector('.game-board-blocks');
  const whosTurn = document.querySelector('.whos-turn');
  const scoreMe = document.querySelector('.score-me');
    const scorePlayer = document.querySelector('.score-player');
    const scoreTie = document.querySelector('.score-tie');


  whosTurn.innerHTML = state.turn;
  updateTurnClass();
  gameBlock.forEach((block, i) => {
    block.innerHTML = state.cells[i];
    block.classList.remove('filled');
  });
  gameBoardBlocks.classList.remove('x-turn', 'o-turn');
  scoreMe.innerHTML = state.score.player1Score;
  scorePlayer.innerHTML = state.score.player2Score;
  scoreTie.innerHTML = state.score.ties;
}

export function nextRound() {
  const nextRoundBtn = document.querySelector('.next-round-btn');
   const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
  const overlaySection = document.querySelector('.overlay-container');
 
    const newState = structuredClone(initialState);
    Object.assign(state.cells, newState.cells);
    state.gameOver = false;

    state.turn = state.players.player1 === ICON_X
    ? state.players.player1
    : state.players.player2;

    whosTurn.innerHTML = state.turn;
    updateTurnClass();

    gameBlock.forEach((block, i) => {
    block.innerHTML = newState.cells[i];
    block.classList.remove('filled');
  });

    overlaySection.hidden = true;
  
    if(state.gameMode === 'cpu' && state.turn === state.players.player2) {
    setTimeout(cpuMoveHandler, 500);
}

}

export function reset() {
  const resetBtn = document.querySelector('.reset-btn-js');

  resetBtn.addEventListener('click', () => {
    showOverlay('reset');
  })
}

function resetGame() {
const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
  const overlaySection = document.querySelector('.overlay-container');

  const newState = structuredClone(initialState);
  Object.assign(state.cells, newState.cells);
    state.turn = initialState.turn;
    whosTurn.innerHTML = state.turn;
    updateTurnClass();
    gameBlock.forEach((block, i) => {
      block.innerHTML = newState.cells[i];
      block.classList.remove('filled');
    });
    overlaySection.hidden = true;
}

export function setupOverlayButtons() {
  const overlaySection = document.querySelector('.overlay-container');
  const greyBtn = document.querySelector('.quit-js-btn');
  const yellowBtn = document.querySelector('.next-round-btn');

  greyBtn.addEventListener('click', () => {
    const action = greyBtn.dataset.action;

    if(action === 'quit') {
      quitGame();
    } else if(action === 'cancel') {
      overlaySection.hidden = true;
    }
  });

  yellowBtn.addEventListener('click', () => {
    const action = yellowBtn.dataset.action;

    if(action === 'nextRound') {
      nextRound();
    } else if(action === 'restart') {
      resetGame();
    }
  });
}

export function cpuMove() {
  const emptyCells = [];
  const winnings = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];
  
  for (let i = 0; i < state.cells.length; i++) {
    if (state.cells[i] === '') {
      emptyCells.push(i);
    }
  }
  //console.log(emptyCells)

  if (emptyCells.length === 0) return null;

  for (const w of winnings) {
    if (state.cells[w[0]] === state.players.player2 && state.cells[w[1]] === state.players.player2 && state.cells[w[2]] === '') {
      return w[2];
    } else if (state.cells[w[0]] === state.players.player2 && state.cells[w[1]] === '' && state.cells[w[2]] === state.players.player2) {
      return w[1];
    } else if (state.cells[w[0]] === '' && state.cells[w[1]] === state.players.player2 && state.cells[w[2]] === state.players.player2) {
      return w[0];
    } 
    //console.log(w[0])
  };

  for (const w of winnings) {
    if (state.cells[w[0]] === state.players.player1 && state.cells[w[1]] === state.players.player1 && state.cells[w[2]] === '') {
      return w[2];
    } else if (state.cells[w[0]] === state.players.player1 && state.cells[w[1]] === '' && state.cells[w[2]] === state.players.player1) {
      return w[1];
    } else if (state.cells[w[0]] === '' && state.cells[w[1]] === state.players.player1 && state.cells[w[2]] === state.players.player1) {
      return w[0];
    } 
  };

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function cpuMoveHandler() {
  const gameBlock = document.querySelectorAll('.game-board-block');
  const whosTurn = document.querySelector('.whos-turn');
  const scorePlayer = document.querySelector('.score-player');
  const scoreTie = document.querySelector('.score-tie');

  if(state.gameOver) return;

  const cpuCell = cpuMove();
  if(cpuCell === null) return;

  const player2 = state.players.player2;
  state.cells[cpuCell] = player2;
  gameBlock[cpuCell].innerHTML = player2;
  gameBlock[cpuCell].classList.add('filled');
  
  if (checkWinner(player2)) {
    setScore (state.score, 'player2Score', scorePlayer);
    state.gameOver = true;
    setTimeout(() => showOverlay('win', player2), 1000);
    return;
  }

  if (checkTie()) {
    setScore(state.score, 'ties', scoreTie);
    state.gameOver = true;
    setTimeout(() => showOverlay('tie'), 1000);
    return;
  }

  state.turn = state.players.player1;
  whosTurn.innerHTML = state.turn;
  updateTurnClass();
}

function updateTurnClass() {
  const board = document.querySelector('.game-board-blocks');

  board.classList.remove('x-turn', 'o-turn');

  if (state.turn === ICON_X) {
    board.classList.add('x-turn');
  } else {
    board.classList.add('o-turn');
  }
}
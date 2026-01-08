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
  gameBlock.forEach(block => {
    const cell = block.dataset.cell;
    
     whosTurn.innerHTML = state.turn;
    block.addEventListener('click', () => {
     console.log(block);
      console.log(state.turn)
      if (state.cells[cell] === '') {
        // state.cells[cell] = block;
        
        if (state.turn === state.players.player1) {
          state.cells[cell] = state.players.player1;
          block.innerHTML = state.players.player1;
          state.turn = state.players.player2;
           whosTurn.innerHTML = state.turn;
        } else {
          state.cells[cell] = state.players.player2;
          block.innerHTML = state.players.player2;
          state.turn = state.players.player1;
           whosTurn.innerHTML = state.turn;
        }

        if (state.cells[0] === state.players.player1 && state.cells[1] === state.players.player1 && state.cells[2] === state.players.player1) {
          state.score.player1Score += 1;
          scoreMe.innerHTML = state.score.player1Score;
          
        }
        
        console.log(state.cells)
      } else {
        return;
      } 
    });
    
    
  });

  
}
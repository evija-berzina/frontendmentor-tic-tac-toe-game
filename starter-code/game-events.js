import {state} from './game-state.js';


export function setupPlayerMark () {
  const markBtn = document.querySelectorAll('.mark-btn-js');
    
  markBtn.forEach(button => { 
    button.addEventListener('click', () => {  
      const mark = button.dataset.mark;
      state.players.player1 = mark;
      state.players.player2 = mark === 'x' ? 'o' : 'x';

      markBtn.forEach (btn => {
        if(btn === button) {
          btn.setAttribute('aria-selected', true);
        } else {
          btn.setAttribute('aria-selected', false);
        }
      });
    }); 
  });
}

export function setupGameMode () {
  const newGameBtn = document.querySelectorAll('.new-game-btn');

  newGameBtn.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      state.gameMode = mode;
    });
  });
}
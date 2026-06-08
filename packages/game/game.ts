import { type Game } from 'boardgame.io';

import { moveToken, resolveRoll, startRoll } from './moves/boardMoves';
import { castVote, setColor, setName, toggleReady } from './moves/lobbyMoves';
import { setupLudo } from './setup';
import { type LudoGameState } from './types';

export const Ludo: Game<LudoGameState> = {
  name: 'Ne ljuti se čoveče!',
  setup: setupLudo,
  moves: {
    // Lobby moves
    setName,
    setColor,
    toggleReady,
    castVote,

    // Board moves
    startRoll,
    resolveRoll,
    moveToken,
  },
};

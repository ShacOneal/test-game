import { type Game } from 'boardgame.io';

import { setupLudo } from './setup';
import { type LudoGameState } from './types';

export const Ludo: Game<LudoGameState> = {
  name: 'Ne ljuti se čoveče!',
  setup: setupLudo,
};

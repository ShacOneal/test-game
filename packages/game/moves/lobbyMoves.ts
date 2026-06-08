import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { LudoGameState } from '../types';

const VALID_COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'teal',
  'pink',
];

export const setName: Move<LudoGameState> = ({ G, playerID }, name: string) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE; // Validate playerID

  const cleanName = name
    .replace(/<|>|\$\{|\}/g, '')
    .replace(/\s+/g, ' ')
    .trim(); // Sanitize name

  G.players[playerID].name = cleanName;
};

export const setColor: Move<LudoGameState> = (
  { G, playerID },
  color: string,
) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE;
  if (!VALID_COLORS.includes(color)) return INVALID_MOVE; // Validate color choice

  const isColorTaken = Object.entries(G.players).some(
    ([id, player]) => player.color === color && id !== playerID,
  );

  if (isColorTaken) return INVALID_MOVE; // Prevent duplicate colors

  G.players[playerID].color = color;
};

export const toggleReady: Move<LudoGameState> = ({ G, playerID }) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE;

  G.players[playerID].isReady = !G.players[playerID].isReady;
};

export const castVote: Move<LudoGameState> = (
  { G, playerID },
  voteType: 'continue' | 'exit',
) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE;
  if (G.players[playerID].hasVoted) return INVALID_MOVE; // Prevent double voting

  if (voteType === 'continue') {
    G.votes.continue += 1;
  } else if (voteType === 'exit') {
    G.votes.exit += 1;
  }

  G.players[playerID].hasVoted = true;
};

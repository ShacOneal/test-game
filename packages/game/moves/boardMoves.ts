import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { LudoGameState } from '../types';
import { calculateDestination } from '../utils';

export const startRoll: Move<LudoGameState> = ({ G, random, playerID }) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE; // Prevent moves from non-players
  if (G.diceValue !== null) return INVALID_MOVE; // Prevent rolling the dice multiple times in a turn

  if (G.players[playerID].tokens.every((token) => token.status === 'COMPLETE'))
    return INVALID_MOVE; // No need to roll if all tokens are complete

  G.diceValue = random.D6(); // Roll a six-sided dice
  G.isRolling = true; // Set rolling state to true
};

export const resolveRoll: Move<LudoGameState> = ({ G, playerID, events }) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE; // Prevent moves from non-players
  if (!G.isRolling) return INVALID_MOVE; // Can only resolve after rolling

  const player = G.players[playerID];
  const roll = G.diceValue;

  if (roll === null) return INVALID_MOVE; // Type guard, it should never happen

  G.isRolling = false; // Reset rolling state

  let hasValidMove = false;

  for (let i = 0; i < player.tokens.length; i++) {
    const token = player.tokens[i];
    const newPosition = calculateDestination(
      token.position,
      roll,
      token.status,
    );

    if (newPosition !== null) {
      let newStatus: 'TRACK' | 'SAFE' | 'COMPLETE' = 'TRACK';
      if (newPosition === 57) newStatus = 'COMPLETE';
      else if (newPosition >= 52) newStatus = 'SAFE';

      const isSelfStacking = player.tokens.some(
        (t, index) =>
          index !== i &&
          t.position === newPosition &&
          t.status === newStatus &&
          newStatus !== 'COMPLETE',
      );
      if (!isSelfStacking) {
        hasValidMove = true;
        break; // We just need to know if there's at least one valid move
      }
    }
  }

  if (!hasValidMove) {
    G.diceValue = null;

    if (roll !== 6) {
      events.endTurn();
    }
  }
};

export const moveToken: Move<LudoGameState> = (
  { G, playerID, events },
  tokenIndex: number,
) => {
  if (!playerID || !G.players[playerID]) return INVALID_MOVE; // Validate playerID
  if (G.diceValue === null) return INVALID_MOVE; // Must roll the dice before moving
  if (tokenIndex < 0 || tokenIndex >= G.players[playerID].tokens.length)
    return INVALID_MOVE; // Validate token index

  const player = G.players[playerID];
  const token = player.tokens[tokenIndex];

  const newPosition = calculateDestination(
    token.position,
    G.diceValue,
    token.status,
  );
  if (newPosition === null) return INVALID_MOVE; // Invalid move based on game rules

  let newStatus: 'TRACK' | 'SAFE' | 'COMPLETE' = 'TRACK';
  if (newPosition === 57) {
    newStatus = 'COMPLETE';
  } else if (newPosition >= 52) {
    newStatus = 'SAFE';
  }

  const isSelfStacking = player.tokens.some(
    (t, index) =>
      index !== tokenIndex &&
      t.position === newPosition &&
      t.status === newStatus &&
      newStatus !== 'COMPLETE',
  );
  if (isSelfStacking) return INVALID_MOVE; // Prevent stacking on own tokens

  token.position = newPosition;
  token.status = newStatus;

  if (token.status === 'TRACK') {
    const myAbsolutePosition = (token.position + player.delay) % 52;

    Object.entries(G.players).forEach(([otherPlayerID, otherPlayer]) => {
      if (otherPlayerID !== playerID) {
        otherPlayer.tokens.forEach((otherToken) => {
          if (otherToken.status === 'TRACK') {
            const theirAbsolutePosition =
              (otherToken.position + otherPlayer.delay) % 52;

            if (myAbsolutePosition === theirAbsolutePosition) {
              otherToken.position = 0;
              otherToken.status = 'BASE';
            }
          }
        });
      }
    });
  }

  const rolledSix = G.diceValue === 6;
  G.diceValue = null;

  if (!rolledSix) {
    events.endTurn();
  }
};

import { type Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { type LudoGameState } from '../types';
import { castVote, setColor, setName, toggleReady } from './lobbyMoves';

interface LobbyContext {
  G: LudoGameState;
  playerID: string;
  ctx: Ctx;
}

const createLobbyArgs = (G: LudoGameState, playerID: string): LobbyContext => ({
  G,
  playerID,
  ctx: { currentPlayer: '0' } as Ctx,
});

const executeMove = <T extends unknown[]>(
  move: unknown,
  ctxArg: LobbyContext,
  ...args: T
) => {
  const fn = move as (
    ctx: LobbyContext,
    ...args: T
  ) => void | typeof INVALID_MOVE;
  return fn(ctxArg, ...args);
};

describe('Lobby Moves', () => {
  let mockG: LudoGameState;

  beforeEach(() => {
    mockG = {
      players: {
        '0': {
          name: null,
          color: null,
          isReady: false,
          delay: 0,
          hasVoted: false,
          tokens: [],
        },
        '1': {
          name: null,
          color: null,
          isReady: false,
          delay: 13,
          hasVoted: false,
          tokens: [],
        },
      },
      finishOrder: [],
      diceValue: null,
      votes: { continue: 0, exit: 0 },
    };
  });

  describe('setName', () => {
    test('should set and sanitize the player name', () => {
      executeMove(setName, createLobbyArgs(mockG, '0'), '  <Bad> Name ${}  ');
      expect(mockG.players['0'].name).toBe('Bad Name');
    });

    test('should return INVALID_MOVE if playerID is invalid', () => {
      const result = executeMove(setName, createLobbyArgs(mockG, '99'), 'Name');
      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('setColor', () => {
    test('should set a valid color for the player', () => {
      executeMove(setColor, createLobbyArgs(mockG, '0'), 'red');
      expect(mockG.players['0'].color).toBe('red');
    });

    test('should allow a player to re-select their own color', () => {
      mockG.players['0'].color = 'blue';
      executeMove(setColor, createLobbyArgs(mockG, '0'), 'blue');
      expect(mockG.players['0'].color).toBe('blue');
    });

    test('should return INVALID_MOVE for invalid colors', () => {
      const result = executeMove(
        setColor,
        createLobbyArgs(mockG, '0'),
        'black',
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if color is already taken by another player', () => {
      mockG.players['1'].color = 'green';
      const result = executeMove(
        setColor,
        createLobbyArgs(mockG, '0'),
        'green',
      );
      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('toggleReady', () => {
    test('should toggle the isReady state', () => {
      executeMove(toggleReady, createLobbyArgs(mockG, '0'));
      expect(mockG.players['0'].isReady).toBe(true);

      executeMove(toggleReady, createLobbyArgs(mockG, '0'));
      expect(mockG.players['0'].isReady).toBe(false);
    });

    test('should return INVALID_MOVE for invalid playerID', () => {
      const result = executeMove(toggleReady, createLobbyArgs(mockG, '99'));
      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('castVote', () => {
    test('should increment continue vote and mark as voted', () => {
      executeMove(castVote, createLobbyArgs(mockG, '0'), 'continue');
      expect(mockG.votes.continue).toBe(1);
      expect(mockG.players['0'].hasVoted).toBe(true);
    });

    test('should increment exit vote and mark as voted', () => {
      executeMove(castVote, createLobbyArgs(mockG, '1'), 'exit');
      expect(mockG.votes.exit).toBe(1);
      expect(mockG.players['1'].hasVoted).toBe(true);
    });

    test('should return INVALID_MOVE if player already voted', () => {
      mockG.players['0'].hasVoted = true;
      const result = executeMove(
        castVote,
        createLobbyArgs(mockG, '0'),
        'continue',
      );
      expect(result).toBe(INVALID_MOVE);
      expect(mockG.votes.continue).toBe(0);
    });
  });

  describe('Missing Branch Coverage Tests', () => {
    test('setColor should return INVALID_MOVE for missing playerID', () => {
      expect(executeMove(setColor, createLobbyArgs(mockG, '99'), 'red')).toBe(
        INVALID_MOVE,
      );
    });

    test('castVote should return INVALID_MOVE for missing playerID', () => {
      expect(
        executeMove(castVote, createLobbyArgs(mockG, '99'), 'continue'),
      ).toBe(INVALID_MOVE);
    });
  });
});

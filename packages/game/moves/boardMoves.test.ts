import { type Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { type LudoGameState } from '../types';
import { moveToken, resolveRoll, startRoll } from './boardMoves';

interface MockEvents {
  endTurn: ReturnType<typeof jest.fn>;
}
interface MockRandom {
  D6: ReturnType<typeof jest.fn>;
}

interface BoardContext {
  G: LudoGameState;
  playerID: string;
  ctx: Ctx;
  events?: MockEvents;
  random?: MockRandom;
}

const createBoardArgs = (
  G: LudoGameState,
  playerID: string,
  events?: MockEvents,
  random?: MockRandom,
): BoardContext => ({
  G,
  playerID,
  ctx: { currentPlayer: '0' } as Ctx,
  events,
  random,
});

const executeMove = <T extends unknown[]>(
  move: unknown,
  ctxArg: BoardContext,
  ...args: T
) => {
  const fn = move as (
    ctx: BoardContext,
    ...args: T
  ) => void | typeof INVALID_MOVE;
  return fn(ctxArg, ...args);
};

describe('Board Moves', () => {
  let mockG: LudoGameState;
  let mockEvents: MockEvents;
  let mockRandom: MockRandom;

  beforeEach(() => {
    mockEvents = { endTurn: jest.fn() };
    mockRandom = { D6: jest.fn(() => 4) };

    mockG = {
      players: {
        '0': {
          name: 'Player 0',
          color: 'red',
          isReady: true,
          startSpace: 0,
          hasVoted: false,
          tokens: [
            { id: 't_0_0', position: 0, status: 'BASE' },
            { id: 't_0_1', position: 10, status: 'TRACK' },
          ],
        },
        '1': {
          name: 'Player 1',
          color: 'blue',
          isReady: true,
          startSpace: 13,
          hasVoted: false,
          tokens: [
            { id: 't_1_0', position: 14, status: 'TRACK' },
            { id: 't_1_1', position: 0, status: 'BASE' },
          ],
        },
      },
      finishOrder: [],
      diceValue: null,
      isRolling: false,
      votes: { continue: 0, exit: 0 },
    };
  });

  describe('startRoll', () => {
    test('should return INVALID_MOVE if playerID is invalid', () => {
      const result = executeMove(
        startRoll,
        createBoardArgs(mockG, '99', mockEvents, mockRandom),
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should set diceValue and isRolling to true', () => {
      executeMove(
        startRoll,
        createBoardArgs(mockG, '0', mockEvents, mockRandom),
      );
      expect(mockG.diceValue).toBe(4);
      expect(mockG.isRolling).toBe(true);
    });

    test('should return INVALID_MOVE if already rolled', () => {
      mockG.diceValue = 3;
      const result = executeMove(
        startRoll,
        createBoardArgs(mockG, '0', mockEvents, mockRandom),
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if all tokens are COMPLETE', () => {
      mockG.players['0'].tokens.forEach((t) => (t.status = 'COMPLETE'));
      const result = executeMove(
        startRoll,
        createBoardArgs(mockG, '0', mockEvents, mockRandom),
      );
      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('resolveRoll', () => {
    test('should return INVALID_MOVE if not rolling', () => {
      mockG.diceValue = 4;
      mockG.isRolling = false;
      const result = executeMove(
        resolveRoll,
        createBoardArgs(mockG, '0', mockEvents),
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if roll is null', () => {
      mockG.diceValue = null;
      mockG.isRolling = true;
      const result = executeMove(
        resolveRoll,
        createBoardArgs(mockG, '0', mockEvents),
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if playerID is invalid', () => {
      const result = executeMove(
        resolveRoll,
        createBoardArgs(mockG, '99', mockEvents),
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should end turn and reset dice if no valid moves and roll is not 6', () => {
      mockG.diceValue = 4;
      mockG.isRolling = true;
      mockG.players['0'].tokens[1].status = 'COMPLETE';

      executeMove(resolveRoll, createBoardArgs(mockG, '0', mockEvents));

      expect(mockG.isRolling).toBe(false);
      expect(mockG.diceValue).toBeNull();
      expect(mockEvents.endTurn).toHaveBeenCalledTimes(1);
    });

    test('should NOT end turn and keep diceValue if a valid move exists', () => {
      mockG.diceValue = 4;
      mockG.isRolling = true;

      executeMove(resolveRoll, createBoardArgs(mockG, '0', mockEvents));

      expect(mockG.isRolling).toBe(false);
      expect(mockG.diceValue).toBe(4);
      expect(mockEvents.endTurn).not.toHaveBeenCalled();
    });

    test('should reset dice but NOT end turn if no valid moves and roll is 6', () => {
      mockG.diceValue = 6;
      mockG.isRolling = true;
      mockG.players['0'].tokens.forEach((t) => (t.status = 'COMPLETE'));

      executeMove(resolveRoll, createBoardArgs(mockG, '0', mockEvents));

      expect(mockG.isRolling).toBe(false);
      expect(mockG.diceValue).toBeNull();
      expect(mockEvents.endTurn).not.toHaveBeenCalled();
    });

    test('should end turn if the only valid moves are blocked by self-stacking', () => {
      mockG.diceValue = 4;
      mockG.isRolling = true;

      mockG.players['0'].tokens[0].status = 'BASE';

      mockG.players['0'].tokens[1].position = 51;
      mockG.players['0'].tokens[1].status = 'TRACK';

      mockG.players['0'].tokens.push({
        id: 't_0_2',
        position: 55,
        status: 'SAFE',
      });

      executeMove(resolveRoll, createBoardArgs(mockG, '0', mockEvents));

      expect(mockG.isRolling).toBe(false);
      expect(mockG.diceValue).toBeNull();
      expect(mockEvents.endTurn).toHaveBeenCalledTimes(1);
    });

    test('should identify a move exactly to COMPLETE (57) as a valid move', () => {
      mockG.diceValue = 2;
      mockG.isRolling = true;

      mockG.players['0'].tokens[1].position = 55;
      mockG.players['0'].tokens[1].status = 'SAFE';

      executeMove(resolveRoll, createBoardArgs(mockG, '0', mockEvents));

      expect(mockG.isRolling).toBe(false);
      expect(mockG.diceValue).toBe(2);
      expect(mockEvents.endTurn).not.toHaveBeenCalled();
    });
  });

  describe('moveToken', () => {
    beforeEach(() => {
      mockG.diceValue = 4;
    });

    test('should return INVALID_MOVE if playerID is invalid', () => {
      const result = executeMove(
        moveToken,
        createBoardArgs(mockG, '99', mockEvents),
        0,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if diceValue is null', () => {
      mockG.diceValue = null;
      const result = executeMove(
        moveToken,
        createBoardArgs(mockG, '0', mockEvents),
        1,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if tokenIndex is out of bounds', () => {
      const result = executeMove(
        moveToken,
        createBoardArgs(mockG, '0', mockEvents),
        5,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if newPosition is null (e.g. overshooting)', () => {
      mockG.players['0'].tokens[1].position = 55;
      mockG.players['0'].tokens[1].status = 'SAFE';

      const result = executeMove(
        moveToken,
        createBoardArgs(mockG, '0', mockEvents),
        1,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should return INVALID_MOVE if stacking on own token', () => {
      mockG.players['0'].tokens[0].position = 14;
      mockG.players['0'].tokens[0].status = 'TRACK';

      const result = executeMove(
        moveToken,
        createBoardArgs(mockG, '0', mockEvents),
        1,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    test('should update position, status, reset diceValue and endTurn on non-6 roll', () => {
      executeMove(moveToken, createBoardArgs(mockG, '0', mockEvents), 1);

      expect(mockG.players['0'].tokens[1].position).toBe(14);
      expect(mockG.players['0'].tokens[1].status).toBe('TRACK');
      expect(mockG.diceValue).toBeNull();
      expect(mockEvents.endTurn).toHaveBeenCalledTimes(1);
    });

    test('should NOT end turn if roll is 6', () => {
      mockG.diceValue = 6;

      executeMove(moveToken, createBoardArgs(mockG, '0', mockEvents), 1);

      expect(mockG.diceValue).toBeNull();
      expect(mockEvents.endTurn).not.toHaveBeenCalled();
    });

    test('should successfully knockout opponents token', () => {
      mockG.diceValue = 17;

      executeMove(moveToken, createBoardArgs(mockG, '0', mockEvents), 1);

      expect(mockG.players['0'].tokens[1].position).toBe(27);
      expect(mockG.players['1'].tokens[0].position).toBe(0);
      expect(mockG.players['1'].tokens[0].status).toBe('BASE');
    });

    test('should transition to SAFE zone correctly', () => {
      mockG.players['0'].tokens[1].position = 50;
      mockG.diceValue = 3;

      executeMove(moveToken, createBoardArgs(mockG, '0', mockEvents), 1);

      expect(mockG.players['0'].tokens[1].position).toBe(53);
      expect(mockG.players['0'].tokens[1].status).toBe('SAFE');
    });

    test('should transition to COMPLETE status when landing exactly on 57', () => {
      mockG.players['0'].tokens[1].position = 55;
      mockG.diceValue = 2;

      executeMove(moveToken, createBoardArgs(mockG, '0', mockEvents), 1);

      expect(mockG.players['0'].tokens[1].position).toBe(57);
      expect(mockG.players['0'].tokens[1].status).toBe('COMPLETE');
    });
  });
});

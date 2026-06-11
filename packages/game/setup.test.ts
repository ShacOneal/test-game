import '@testing-library/jest-dom';

import { setupLudo } from './setup';

describe('Ludo Factory: setupLudo()', () => {
  test('should initialize the core game state with players, finishOrder, and votes', () => {
    const mockCtx = { numPlayers: 4 };

    const G = setupLudo({ ctx: mockCtx });

    expect(G).toHaveProperty('players');
    expect(G).toHaveProperty('finishOrder');
    expect(G).toHaveProperty('votes');

    expect(G.finishOrder).toEqual([]);
    expect(G.votes).toEqual({ continue: 0, exit: 0 });
  });

  test('should initialize exactly 2 players with correct default values and mathematical offsets', () => {
    const mockCtx = { numPlayers: 2 };

    const G = setupLudo({ ctx: mockCtx });
    const playerIDs = Object.keys(G.players);

    expect(playerIDs).toHaveLength(2);
    expect(playerIDs).toEqual(['0', '1']);

    const playerZero = G.players['0'];
    expect(playerZero.name).toBeNull();
    expect(playerZero.color).toBeNull();
    expect(playerZero.isReady).toBe(false);

    expect(G.players['0'].startSpace).toBe(0);
    expect(G.players['1'].startSpace).toBe(13);
  });

  // TEST 3: Dynamic Player Loop (Simulating a 4-player game)
  test('should initialize exactly 4 players with correct mathematical offsets', () => {
    const G = setupLudo({ ctx: { numPlayers: 4 } });
    const playerIDs = Object.keys(G.players);

    expect(playerIDs).toHaveLength(4);
    expect(playerIDs).toEqual(['0', '1', '2', '3']);

    expect(G.players['0'].startSpace).toBe(0);
    expect(G.players['3'].startSpace).toBe(39);
  });

  test('should generate exactly 4 tokens per player with correct IDs, position, and BASE status', () => {
    const G = setupLudo({ ctx: { numPlayers: 3 } });

    const playerTwoTokens = G.players['2'].tokens;

    expect(playerTwoTokens).toHaveLength(4);

    playerTwoTokens.forEach((token, index) => {
      expect(token.id).toBe(`t_2_${index}`);
      expect(token.position).toBe(0);
      expect(token.status).toBe('BASE');
    });
  });
});

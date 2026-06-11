import { setupGame } from './game';

describe('Ludo Game Setup', () => {
  it('should initialize the game', () => {
    expect(setupGame()).toBe('Game is ready!');
  });
});

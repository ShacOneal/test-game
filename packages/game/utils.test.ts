import { calculateDestination } from './utils';

describe('calculateDestination Utils', () => {
  test('should return 0 if status is BASE and roll is 6', () => {
    expect(calculateDestination(0, 6, 'BASE')).toBe(0);
  });

  test('should return null if status is BASE and roll is NOT 6', () => {
    expect(calculateDestination(0, 5, 'BASE')).toBeNull();
  });

  test('should return null if status is COMPLETE', () => {
    expect(calculateDestination(57, 2, 'COMPLETE')).toBeNull();
  });

  test('should return null if new position exceeds 57', () => {
    expect(calculateDestination(55, 4, 'TRACK')).toBeNull();
  });

  test('should return correct new position for valid move', () => {
    expect(calculateDestination(10, 4, 'TRACK')).toBe(14);
  });
});

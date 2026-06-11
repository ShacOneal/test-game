import '@testing-library/jest-dom';

import { Ludo } from './game';
import { setupLudo } from './setup';

describe('Core Game Object', () => {
  test('should export the Ludo game object with correct name and setup function', () => {
    expect(Ludo.name).toBe('Ne ljuti se čoveče!');

    expect(Ludo.setup).toBe(setupLudo);
  });
});

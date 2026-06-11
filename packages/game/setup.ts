import type { LudoGameState, PlayerData, Token } from './types';

function tokenMaker2000(playerID: string): Token[] {
  return [0, 1, 2, 3].map((index) => ({
    id: `t_${playerID}_${index}`,
    position: 0,
    status: 'BASE',
  }));
}

export const setupLudo = ({
  ctx,
}: {
  ctx: { numPlayers: number };
}): LudoGameState => {
  const players: Record<string, PlayerData> = {};

  for (let i = 0; i < ctx.numPlayers; i++) {
    const id = i.toString();

    players[id] = {
      name: null,
      color: null,
      isReady: false,
      startSpace: i * 13, // The starting space on the map for each player is determined by multiplying their index by 13
      tokens: tokenMaker2000(id),
    };
  }
  return {
    players: players,
    finishOrder: [],
    votes: {
      continue: 0,
      exit: 0,
    },
  };
};

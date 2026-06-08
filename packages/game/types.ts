export interface Token {
  id: string;
  position: number;
  status: 'BASE' | 'TRACK' | 'SAFE' | 'COMPLETE';
}

export interface PlayerData {
  name: string | null;
  color: string | null;
  isReady: boolean;
  delay: number;
  hasVoted: boolean;
  tokens: Token[];
}

export interface LudoGameState {
  players: Record<string, PlayerData>;
  finishOrder: string[];
  diceValue: number | null;
  isRolling?: boolean;
  votes: { continue: number; exit: number };
}

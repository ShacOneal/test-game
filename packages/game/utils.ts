export const calculateDestination = (
  position: number,
  diceRoll: number,
  status: 'BASE' | 'TRACK' | 'SAFE' | 'COMPLETE',
): number | null => {
  if (status === 'BASE') return diceRoll === 6 ? 0 : null; // Can only enter the track on a 6
  if (status === 'COMPLETE') return null; // Can't move if already complete

  const newPosition = position + diceRoll;

  if (newPosition > 57) return null; // Can't move beyond the final position

  return newPosition;
};

const MAX_POINT = 100;
const TIME_LIMIT = 3600;

export function calculateScore(timeTaken: number): number {
  if (timeTaken <= 0) return MAX_POINT;
  const rawScore = MAX_POINT * (1 / (1 + timeTaken / TIME_LIMIT));
  return Math.ceil(rawScore);
}

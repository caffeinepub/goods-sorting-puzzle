import { type BallColor, TUBE_CAPACITY, type Tube } from "./levels";

export interface MoveRecord {
  fromTube: number;
  toTube: number;
  ball: BallColor;
}

export interface GameState {
  tubes: Tube[];
  selectedTube: number | null;
  moveHistory: MoveRecord[];
  moveCount: number;
  isComplete: boolean;
}

export function initGameState(tubes: Tube[]): GameState {
  return {
    tubes: tubes.map((t) => [...t]),
    selectedTube: null,
    moveHistory: [],
    moveCount: 0,
    isComplete: false,
  };
}

export function getTopBall(tube: Tube): BallColor | null {
  return tube.length > 0 ? tube[tube.length - 1] : null;
}

export function canMove(
  tubes: Tube[],
  fromIdx: number,
  toIdx: number,
): boolean {
  const from = tubes[fromIdx];
  const to = tubes[toIdx];
  if (from.length === 0) return false;
  if (to.length >= TUBE_CAPACITY) return false;
  const topFrom = getTopBall(from)!;
  const topTo = getTopBall(to);
  return topTo === null || topTo === topFrom;
}

export function isTubeComplete(tube: Tube): boolean {
  if (tube.length === 0) return true;
  if (tube.length !== TUBE_CAPACITY) return false;
  return tube.every((b) => b === tube[0]);
}

export function isGameComplete(tubes: Tube[]): boolean {
  return tubes.every(isTubeComplete);
}

export function applyMove(
  state: GameState,
  fromIdx: number,
  toIdx: number,
): GameState {
  if (!canMove(state.tubes, fromIdx, toIdx)) return state;
  const newTubes = state.tubes.map((t) => [...t]);
  const ball = newTubes[fromIdx].pop()!;
  newTubes[toIdx].push(ball);
  const complete = isGameComplete(newTubes);
  return {
    tubes: newTubes,
    selectedTube: null,
    moveHistory: [
      ...state.moveHistory,
      { fromTube: fromIdx, toTube: toIdx, ball },
    ],
    moveCount: state.moveCount + 1,
    isComplete: complete,
  };
}

export function undoMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) return state;
  const history = [...state.moveHistory];
  const last = history.pop()!;
  const newTubes = state.tubes.map((t) => [...t]);
  newTubes[last.fromTube].push(newTubes[last.toTube].pop()!);
  return {
    tubes: newTubes,
    selectedTube: null,
    moveHistory: history,
    moveCount: state.moveCount,
    isComplete: false,
  };
}

export function calcStarRating(moveCount: number, colorCount: number): number {
  const base = colorCount * 3;
  if (moveCount <= base) return 3;
  if (moveCount <= base * 1.8) return 2;
  return 1;
}

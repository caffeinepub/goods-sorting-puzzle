import { RotateCcw, Undo2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useReducer } from "react";
import {
  type GameState,
  applyMove,
  calcStarRating,
  canMove,
  initGameState,
  undoMove,
} from "../game/gameLogic";
import type { LevelData } from "../game/levels";
import LevelCompleteOverlay from "./LevelCompleteOverlay";
import Tube from "./Tube";

type Action =
  | { type: "SELECT"; idx: number }
  | { type: "UNDO" }
  | { type: "RESTART"; tubes: LevelData["tubes"] };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT": {
      const { idx } = action;
      if (state.selectedTube === null) {
        if (state.tubes[idx].length === 0) return state;
        return { ...state, selectedTube: idx };
      }
      if (state.selectedTube === idx) return { ...state, selectedTube: null };
      if (canMove(state.tubes, state.selectedTube, idx)) {
        return applyMove(state, state.selectedTube, idx);
      }
      if (state.tubes[idx].length > 0) return { ...state, selectedTube: idx };
      return { ...state, selectedTube: null };
    }
    case "UNDO":
      return undoMove(state);
    case "RESTART":
      return initGameState(action.tubes);
    default:
      return state;
  }
}

interface GameBoardProps {
  level: LevelData;
  onLevelComplete: (moves: number) => void;
  onNextLevel: () => void;
  onReplay: () => void;
  isLastLevel: boolean;
  bestMoves?: number;
}

export default function GameBoard({
  level,
  onLevelComplete,
  onNextLevel,
  onReplay,
  isLastLevel,
  bestMoves,
}: GameBoardProps) {
  const [state, dispatch] = useReducer(reducer, level.tubes, initGameState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally restart only on level id change
  useEffect(() => {
    dispatch({ type: "RESTART", tubes: level.tubes });
  }, [level.id]);

  useEffect(() => {
    if (state.isComplete) {
      onLevelComplete(state.moveCount);
    }
  }, [state.isComplete, state.moveCount, onLevelComplete]);

  const handleTubeClick = useCallback(
    (idx: number) => {
      if (state.isComplete) return;
      dispatch({ type: "SELECT", idx });
    },
    [state.isComplete],
  );

  const handleUndo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const handleRestart = useCallback(
    () => dispatch({ type: "RESTART", tubes: level.tubes }),
    [level.tubes],
  );

  const { tubes, selectedTube, moveCount } = state;
  const ballSize = tubes.length > 8 ? 36 : tubes.length > 6 ? 40 : 44;
  const colorSet = new Set(tubes.flat());
  const stars = calcStarRating(moveCount, colorSet.size);

  // Pre-compute tube render data with stable keys
  const tubeItems = tubes.map((tube, i) => ({
    tube,
    tubeKey: `t${i}`,
    idx: i,
  }));

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div
        className="flex flex-wrap justify-center gap-3 px-2"
        style={{ maxWidth: "min(100%, 700px)" }}
        data-ocid="gameboard.panel"
      >
        {tubeItems.map(({ tube, tubeKey, idx }) => (
          <Tube
            key={tubeKey}
            tube={tube}
            index={idx}
            isSelected={selectedTube === idx}
            canReceive={
              selectedTube !== null &&
              selectedTube !== idx &&
              canMove(tubes, selectedTube, idx)
            }
            onClick={handleTubeClick}
            ballSize={ballSize}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-2" data-ocid="controls.panel">
        <button
          type="button"
          data-ocid="undo.button"
          onClick={handleUndo}
          disabled={state.moveHistory.length === 0}
          className="btn-hover flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all"
          style={{
            background: "rgba(180,210,235,0.18)",
            border: "1.5px solid rgba(180,210,235,0.4)",
            color:
              state.moveHistory.length === 0
                ? "rgba(180,210,235,0.35)"
                : "#e0efff",
            cursor: state.moveHistory.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          <Undo2 size={16} />
          Undo
        </button>
        <button
          type="button"
          data-ocid="restart.button"
          onClick={handleRestart}
          className="btn-hover flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm"
          style={{
            background: "rgba(180,210,235,0.18)",
            border: "1.5px solid rgba(180,210,235,0.4)",
            color: "#e0efff",
          }}
        >
          <RotateCcw size={16} />
          Restart
        </button>
      </div>

      <AnimatePresence>
        {state.isComplete && (
          <LevelCompleteOverlay
            moveCount={moveCount}
            stars={stars}
            bestMoves={bestMoves}
            onNextLevel={onNextLevel}
            onReplay={onReplay}
            isLastLevel={isLastLevel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

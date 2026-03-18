import { Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Confetti from "./Confetti";

interface LevelCompleteOverlayProps {
  moveCount: number;
  stars: number;
  bestMoves?: number;
  onNextLevel: () => void;
  onReplay: () => void;
  isLastLevel: boolean;
}

export default function LevelCompleteOverlay({
  moveCount,
  stars,
  bestMoves,
  onNextLevel,
  onReplay,
  isLastLevel,
}: LevelCompleteOverlayProps) {
  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          background: "rgba(20,40,60,0.75)",
          backdropFilter: "blur(8px)",
        }}
        data-ocid="level_complete.modal"
      >
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="rounded-3xl p-8 flex flex-col items-center gap-6 text-center mx-4"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.32 0.07 225), oklch(0.26 0.065 230))",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
            border: "1.5px solid rgba(180,210,235,0.25)",
            maxWidth: 380,
            width: "100%",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(47,191,107,0.18)",
              border: "2px solid rgba(47,191,107,0.4)",
            }}
          >
            <Trophy size={40} color="#2FBF6B" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Level Complete!
            </h2>
            <p className="text-sm" style={{ color: "rgba(180,210,235,0.7)" }}>
              {moveCount} moves used{bestMoves ? ` · Best: ${bestMoves}` : ""}
            </p>
          </div>

          <div className="flex gap-3">
            {[1, 2, 3].map((s, i) => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2 + i * 0.15,
                  type: "spring",
                  damping: 12,
                }}
              >
                <Star
                  size={44}
                  fill={s <= stars ? "#F6C21A" : "rgba(180,210,235,0.2)"}
                  color={s <= stars ? "#F6C21A" : "rgba(180,210,235,0.3)"}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              data-ocid="level_complete.cancel_button"
              onClick={onReplay}
              className="btn-hover flex-1 py-3 rounded-full font-semibold text-sm"
              style={{
                border: "1.5px solid rgba(180,210,235,0.4)",
                color: "#e0efff",
                background: "rgba(180,210,235,0.1)",
              }}
            >
              Replay
            </button>
            <button
              type="button"
              data-ocid="level_complete.confirm_button"
              onClick={onNextLevel}
              className="btn-hover flex-1 py-3 rounded-full font-bold text-sm text-white"
              style={{
                background: "#2FBF6B",
                boxShadow: "0 4px 16px rgba(47,191,107,0.4)",
              }}
            >
              {isLastLevel ? "🎉 You Win!" : "Next Level →"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

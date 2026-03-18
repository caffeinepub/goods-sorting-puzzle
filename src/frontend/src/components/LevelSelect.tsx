import { Lock, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import { LEVELS } from "../game/levels";

interface LevelSelectProps {
  unlockedUpTo: number;
  bestMoves: Map<number, number>;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
}

export default function LevelSelect({
  unlockedUpTo,
  bestMoves,
  onSelectLevel,
  onBack,
}: LevelSelectProps) {
  return (
    <div className="min-h-screen flex flex-col" data-ocid="level_select.page">
      <header className="flex items-center justify-between px-6 py-4">
        <button
          type="button"
          data-ocid="level_select.cancel_button"
          onClick={onBack}
          className="btn-hover px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: "rgba(180,210,235,0.15)",
            border: "1.5px solid rgba(180,210,235,0.3)",
            color: "#e0efff",
          }}
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Select Level
        </h1>
        <div style={{ width: 72 }} />
      </header>

      <main className="flex-1 px-4 pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {LEVELS.map((level, i) => {
            const unlocked = level.id <= unlockedUpTo;
            const best = bestMoves.get(level.id);
            const ballCount = level.tubes.flat().length;
            const stars = best
              ? best <= ballCount
                ? 3
                : best <= ballCount * 2
                  ? 2
                  : 1
              : 0;

            return (
              <motion.button
                type="button"
                key={level.id}
                data-ocid={`level_select.item.${i + 1}`}
                onClick={() => unlocked && onSelectLevel(level.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", damping: 18 }}
                className="relative flex flex-col items-center justify-center gap-1 rounded-2xl p-4 aspect-square"
                style={{
                  background: unlocked
                    ? "rgba(180,210,235,0.14)"
                    : "rgba(120,150,180,0.07)",
                  border: unlocked
                    ? "1.5px solid rgba(180,210,235,0.35)"
                    : "1.5px solid rgba(120,150,180,0.2)",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                {unlocked ? (
                  <>
                    <span className="text-2xl font-bold text-white">
                      {level.id}
                    </span>
                    {stars > 0 && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            fill={s <= stars ? "#F6C21A" : "transparent"}
                            color={
                              s <= stars ? "#F6C21A" : "rgba(180,210,235,0.4)"
                            }
                          />
                        ))}
                      </div>
                    )}
                    {stars === 0 && (
                      <Play size={14} color="rgba(180,210,235,0.6)" />
                    )}
                  </>
                ) : (
                  <>
                    <Lock size={20} color="rgba(180,210,235,0.4)" />
                    <span
                      className="text-xs"
                      style={{ color: "rgba(180,210,235,0.4)" }}
                    >
                      {level.id}
                    </span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

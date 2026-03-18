import { motion } from "motion/react";
import { LEVELS, getLevel } from "../game/levels";

interface LevelSelectProps {
  firstUnbeatenLevel: number;
  bestTimes: Map<number, number>;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
}

const DIFF_COLORS: Record<string, string> = {
  easy: "oklch(0.72 0.18 155)",
  medium: "oklch(0.75 0.18 75)",
  hard: "oklch(0.68 0.22 25)",
};

const DIFF_BG: Record<string, string> = {
  easy: "oklch(0.24 0.08 155 / 0.5)",
  medium: "oklch(0.26 0.1 75 / 0.5)",
  hard: "oklch(0.24 0.1 25 / 0.5)",
};

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function LevelSelect({
  firstUnbeatenLevel,
  bestTimes,
  onSelectLevel,
  onBack,
}: LevelSelectProps) {
  const totalLevels = 100;

  return (
    <div
      data-ocid="level_select.page"
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, oklch(0.14 0.04 265) 0%, oklch(0.11 0.03 280) 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid oklch(0.28 0.05 265 / 0.5)",
          background: "oklch(0.16 0.04 265 / 0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          data-ocid="level_select.cancel_button"
          onClick={onBack}
          style={{
            background: "oklch(0.22 0.05 265 / 0.8)",
            border: "1.5px solid oklch(0.35 0.06 265 / 0.6)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            color: "oklch(0.82 0.03 265)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          ← Back
        </button>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "oklch(0.92 0.02 265)",
              margin: 0,
            }}
          >
            Choose Level
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "oklch(0.58 0.05 265)",
              margin: 0,
            }}
          >
            {firstUnbeatenLevel - 1} / {totalLevels} completed
          </p>
        </div>
      </header>

      <main style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        {/* Difficulty legend */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {(["easy", "medium", "hard"] as const).map((d) => (
            <div
              key={d}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 700,
                color: DIFF_COLORS[d],
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: DIFF_COLORS[d],
                }}
              />
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </div>
          ))}
        </div>

        <div
          data-ocid="level_select.list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: 8,
          }}
        >
          {Array.from({ length: totalLevels }, (_, i) => {
            const levelId = i + 1;
            const level =
              levelId <= LEVELS.length ? LEVELS[i] : getLevel(levelId);
            const isCompleted = levelId < firstUnbeatenLevel;
            const isCurrent = levelId === firstUnbeatenLevel;
            const isLocked = levelId > firstUnbeatenLevel;
            const bestTime = bestTimes.get(levelId);

            return (
              <motion.button
                type="button"
                key={levelId}
                data-ocid={`level_select.item.${levelId <= 3 ? levelId : 1}`}
                onClick={() => !isLocked && onSelectLevel(levelId)}
                disabled={isLocked}
                whileHover={!isLocked ? { scale: 1.06, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.94 } : {}}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.008, 0.4) }}
                style={{
                  padding: "10px 6px",
                  borderRadius: 12,
                  border: isCurrent
                    ? `2px solid ${DIFF_COLORS[level.difficulty]}`
                    : isCompleted
                      ? `1.5px solid ${DIFF_COLORS[level.difficulty]}55`
                      : "1.5px solid oklch(0.28 0.04 265 / 0.4)",
                  background: isCurrent
                    ? DIFF_BG[level.difficulty]
                    : isCompleted
                      ? "oklch(0.2 0.04 265 / 0.7)"
                      : "oklch(0.16 0.03 265 / 0.5)",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  opacity: isLocked ? 0.35 : 1,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: isCurrent
                      ? DIFF_COLORS[level.difficulty]
                      : isCompleted
                        ? "oklch(0.75 0.04 265)"
                        : "oklch(0.42 0.03 265)",
                  }}
                >
                  {isLocked ? "🔒" : isCompleted ? "✓" : levelId}
                </div>
                {!isLocked && (
                  <div
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: DIFF_COLORS[level.difficulty],
                      letterSpacing: "0.04em",
                    }}
                  >
                    {level.difficulty[0].toUpperCase()}
                  </div>
                )}
                {bestTime !== undefined && (
                  <div
                    style={{
                      fontSize: 8,
                      color: "oklch(0.55 0.04 265)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatTime(bestTime)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "10px",
          borderTop: "1px solid oklch(0.22 0.04 265 / 0.5)",
        }}
      >
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: "oklch(0.4 0.03 265)" }}
        >
          © {new Date().getFullYear()} · Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

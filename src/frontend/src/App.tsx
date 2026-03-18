import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layers, List } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import HomeScreen from "./components/HomeScreen";
import LevelSelect from "./components/LevelSelect";
import { LEVELS } from "./game/levels";
import { useGameProgress, useSaveProgress } from "./hooks/useQueries";

const queryClient = new QueryClient();

type Screen = "home" | "select" | "game";

function GameApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [localUnlocked, setLocalUnlocked] = useState(1);
  const [localBestMoves, setLocalBestMoves] = useState<Map<number, number>>(
    new Map(),
  );

  const { data: progress } = useGameProgress();
  const saveProgress = useSaveProgress();

  useEffect(() => {
    if (progress) {
      setLocalUnlocked(progress.currentLevel);
      setLocalBestMoves(progress.bestMoves);
      setCurrentLevelId(Math.min(progress.currentLevel, LEVELS.length));
    }
  }, [progress]);

  const currentLevel = LEVELS.find((l) => l.id === currentLevelId) ?? LEVELS[0];
  const isLastLevel = currentLevelId === LEVELS.length;

  const handleLevelComplete = useCallback(
    (moves: number) => {
      const existing = localBestMoves.get(currentLevelId);
      if (!existing || moves < existing) {
        setLocalBestMoves((prev) => {
          const updated = new Map(prev);
          updated.set(currentLevelId, moves);
          return updated;
        });
      }
      const nextLevel = currentLevelId + 1;
      if (nextLevel > localUnlocked && nextLevel <= LEVELS.length) {
        setLocalUnlocked(nextLevel);
      }
      saveProgress.mutate({ level: currentLevelId, moves });
    },
    [currentLevelId, localBestMoves, localUnlocked, saveProgress],
  );

  const handleNextLevel = useCallback(() => {
    if (!isLastLevel) {
      setCurrentLevelId((id) => id + 1);
    } else {
      setScreen("select");
    }
  }, [isLastLevel]);

  const handleReplay = useCallback(() => {
    setCurrentLevelId((id) => id);
  }, []);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.38 0.085 222) 0%, oklch(0.28 0.075 235) 100%)",
        minHeight: "100dvh",
      }}
    >
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HomeScreen
              onPlay={() => setScreen("game")}
              onLevels={() => setScreen("select")}
            />
          </motion.div>
        )}

        {screen === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <LevelSelect
              unlockedUpTo={localUnlocked}
              bestMoves={localBestMoves}
              onSelectLevel={(id) => {
                setCurrentLevelId(id);
                setScreen("game");
              }}
              onBack={() => setScreen("home")}
            />
          </motion.div>
        )}

        {screen === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen flex flex-col"
          >
            <header
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(180,210,235,0.15)" }}
              data-ocid="game.panel"
            >
              <button
                type="button"
                data-ocid="game.cancel_button"
                onClick={() => setScreen("home")}
                className="btn-hover p-2 rounded-full"
                style={{
                  background: "rgba(180,210,235,0.12)",
                  border: "1.5px solid rgba(180,210,235,0.25)",
                }}
              >
                <List size={18} color="#e0efff" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-lg font-black text-white tracking-wide">
                  Sort It!
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "rgba(180,210,235,0.65)" }}
                >
                  Level {currentLevelId} / {LEVELS.length}
                </span>
              </div>

              <button
                type="button"
                data-ocid="level_select.link"
                onClick={() => setScreen("select")}
                className="btn-hover p-2 rounded-full"
                style={{
                  background: "rgba(180,210,235,0.12)",
                  border: "1.5px solid rgba(180,210,235,0.25)",
                }}
              >
                <Layers size={18} color="#e0efff" />
              </button>
            </header>

            <div className="text-center py-2 px-4">
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(180,210,235,0.55)" }}
              >
                {currentLevel.description}
              </span>
            </div>

            <main
              className="flex-1 flex items-start justify-center pt-4 pb-8 px-2"
              data-ocid="game.section"
            >
              <GameBoard
                key={currentLevelId}
                level={currentLevel}
                onLevelComplete={handleLevelComplete}
                onNextLevel={handleNextLevel}
                onReplay={handleReplay}
                isLastLevel={isLastLevel}
                bestMoves={localBestMoves.get(currentLevelId)}
              />
            </main>

            <footer className="text-center py-3 px-4">
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
                style={{ color: "rgba(180,210,235,0.35)" }}
              >
                © {new Date().getFullYear()} · Built with ❤️ using caffeine.ai
              </a>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameApp />
    </QueryClientProvider>
  );
}

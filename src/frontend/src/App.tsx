import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import Album from "./components/Album";
import HomeScreen from "./components/HomeScreen";
import LevelSelect from "./components/LevelSelect";
import ShelfBoard from "./components/ShelfBoard";
import { getLevel } from "./game/levels";
import { useGameProgress } from "./hooks/useQueries";

const queryClient = new QueryClient();

type Screen = "home" | "levelSelect" | "game" | "album";

interface Inventory {
  timeFreezers: number;
  matchMakers: number;
  hammers: number;
}

function GameApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentLevelId, setCurrentLevelId] = useState(1);

  const { data: progress } = useGameProgress();

  const firstUnbeatenLevel = progress?.firstUnbeatenLevel ?? 1;
  const winStreak = progress?.winStreak ?? 0;
  const inventory: Inventory = progress?.inventory ?? {
    timeFreezers: 0,
    matchMakers: 0,
    hammers: 0,
  };
  const earnedCards = progress?.collectedCards ?? [];
  const bestTimes = progress?.bestTimes ?? new Map<number, number>();

  const level = getLevel(currentLevelId);

  const handlePlay = useCallback(() => {
    setCurrentLevelId(firstUnbeatenLevel > 0 ? firstUnbeatenLevel : 1);
    setScreen("game");
  }, [firstUnbeatenLevel]);

  const handleSelectLevel = useCallback((id: number) => {
    setCurrentLevelId(id);
    setScreen("game");
  }, []);

  const handleNextLevel = useCallback(() => {
    setCurrentLevelId((id) => id + 1);
    setScreen("game");
  }, []);

  const handleWin = useCallback((_newStreak: number, _inv: Inventory) => {
    // Progress updates handled inside ShelfBoard via mutations
  }, []);

  const handleLose = useCallback(() => {
    // Streak reset handled inside ShelfBoard
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, oklch(0.14 0.04 265) 0%, oklch(0.11 0.03 280) 100%)",
      }}
    >
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              onPlay={handlePlay}
              onLevels={() => setScreen("levelSelect")}
              onAlbum={() => setScreen("album")}
              winStreak={winStreak}
              collectedCards={earnedCards.length}
            />
          </motion.div>
        )}

        {screen === "levelSelect" && (
          <motion.div
            key="levelSelect"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
          >
            <LevelSelect
              firstUnbeatenLevel={firstUnbeatenLevel}
              bestTimes={bestTimes}
              onSelectLevel={handleSelectLevel}
              onBack={() => setScreen("home")}
            />
          </motion.div>
        )}

        {screen === "game" && (
          <motion.div
            key={`game-${currentLevelId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <ShelfBoard
              level={level}
              winStreak={winStreak}
              earnedCards={earnedCards}
              initialInventory={inventory}
              onGoHome={() => setScreen("home")}
              onGoLevelSelect={() => setScreen("levelSelect")}
              onGoAlbum={() => setScreen("album")}
              onNextLevel={handleNextLevel}
              onWin={handleWin}
              onLose={handleLose}
            />
          </motion.div>
        )}

        {screen === "album" && (
          <motion.div
            key="album"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
          >
            <Album earnedCards={earnedCards} onBack={() => setScreen("home")} />
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

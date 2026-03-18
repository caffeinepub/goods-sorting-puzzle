import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ELEMENT_CARDS } from "../game/elementCards";
import { ITEM_META } from "../game/items";
import type { Level } from "../game/levels";
import {
  useEarnCard,
  useSaveProgress,
  useUpdateInventory,
  useUpdateWinStreak,
} from "../hooks/useQueries";
import PowerUpBar from "./PowerUpBar";
import Shelf from "./Shelf";

const SHELF_CAPACITY = 3;

interface Inventory {
  timeFreezers: number;
  matchMakers: number;
  hammers: number;
}

interface ShelfBoardProps {
  level: Level;
  winStreak: number;
  earnedCards: string[];
  initialInventory: Inventory;
  onGoHome: () => void;
  onGoLevelSelect: () => void;
  onGoAlbum: () => void;
  onNextLevel: () => void;
  onWin: (newStreak: number, inventory: Inventory) => void;
  onLose: () => void;
}

// Consecutive-3 match: only clears if 3 same type appear consecutively
function applyMatches(shelves: string[][]): string[][] {
  return shelves.map((shelf) => {
    let s = [...shelf];
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i <= s.length - 3; i++) {
        if (s[i] === s[i + 1] && s[i + 1] === s[i + 2]) {
          s.splice(i, 3);
          changed = true;
          break;
        }
      }
    }
    return s;
  });
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function computeMatchHints(shelves: string[][]): Set<string> {
  const counts: Record<string, number> = {};
  for (const shelf of shelves)
    for (const item of shelf) counts[item] = (counts[item] || 0) + 1;
  const hints = new Set<string>();
  for (const [type, count] of Object.entries(counts)) {
    if (count >= 2) hints.add(type);
  }
  return hints;
}

function EarnedCardDisplay({ cardId }: { cardId: string }) {
  const card = ELEMENT_CARDS.find((c) => c.id === cardId);
  if (!card) return null;
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.55, type: "spring" }}
      style={{
        background: `linear-gradient(145deg, ${card.color}, oklch(0.15 0.04 265))`,
        borderRadius: 16,
        padding: "20px 24px",
        textAlign: "center",
        border: "1.5px solid rgba(255,255,255,0.18)",
        boxShadow: `0 0 24px ${card.color}55`,
        margin: "12px 0",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 6 }}>{card.symbol}</div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 4,
        }}
      >
        {card.name}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          background: "rgba(0,0,0,0.25)",
          borderRadius: 8,
          padding: "3px 10px",
          display: "inline-block",
          marginBottom: 6,
        }}
      >
        {card.power}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
          fontStyle: "italic",
        }}
      >
        {card.description}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.45)",
          marginTop: 8,
        }}
      >
        {card.rarity}
      </div>
    </motion.div>
  );
}

export default function ShelfBoard({
  level,
  winStreak,
  earnedCards,
  initialInventory,
  onGoHome,
  onGoLevelSelect,
  onGoAlbum,
  onNextLevel,
  onWin,
  onLose,
}: ShelfBoardProps) {
  const [shelves, setShelves] = useState<string[][]>(() =>
    applyMatches(level.shelves.map((s) => [...s])),
  );
  const [history, setHistory] = useState<string[][][]>([]);
  const [selected, setSelected] = useState<{
    shelfIdx: number;
    itemIdx: number;
  } | null>(null);
  const [hammerMode, setHammerMode] = useState(false);
  const [matchHints, setMatchHints] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing",
  );
  const [inventory, setInventory] = useState<Inventory>(initialInventory);
  const [earnedCardId, setEarnedCardId] = useState<string | null>(null);
  const [bossReward, setBossReward] = useState(false);

  // Drag state
  const [dragging, setDragging] = useState<{
    shelfIdx: number;
    itemIdx: number;
    item: string;
    x: number;
    y: number;
  } | null>(null);
  const [dragTargetShelf, setDragTargetShelf] = useState<number | null>(null);
  const shelfRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;

  const frozenUntilRef = useRef(0);
  const [frozen, setFrozen] = useState(false);
  const startTimeRef = useRef(Date.now());
  const inventoryRef = useRef(inventory);
  inventoryRef.current = inventory;
  const shelvesRef = useRef(shelves);
  shelvesRef.current = shelves;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const onLoseRef = useRef(onLose);
  onLoseRef.current = onLose;

  const saveProgress = useSaveProgress();
  const earnCard = useEarnCard();
  const updateWinStreak = useUpdateWinStreak();
  const updateInventory = useUpdateInventory();

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const id = setInterval(() => {
      if (Date.now() < frozenUntilRef.current) return;
      setFrozen(false);
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

  useEffect(() => {
    if (timeLeft === 0 && gameState === "playing") {
      setGameState("lost");
      onLoseRef.current();
    }
  }, [timeLeft, gameState]);

  const handleWin = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    setGameState("won");
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const secondsUsed = Math.min(elapsed, level.timeLimit);

    const unearned = ELEMENT_CARDS.filter((c) => !earnedCards.includes(c.id));
    const pool = unearned.length > 0 ? unearned : ELEMENT_CARDS;
    const card = pool[Math.floor(Math.random() * pool.length)];
    setEarnedCardId(card.id);

    const newStreak = winStreak + 1;
    const isBossWin = level.id % 10 === 0;
    setBossReward(isBossWin);

    earnCard.mutate(card.id);
    saveProgress.mutate({ level: level.id, seconds: secondsUsed });
    updateWinStreak.mutate(newStreak);

    if (isBossWin) {
      const inv = inventoryRef.current;
      const newInv = {
        timeFreezers: inv.timeFreezers + 5,
        matchMakers: inv.matchMakers + 3,
        hammers: inv.hammers + 1,
      };
      setInventory(newInv);
      updateInventory.mutate(newInv);
      onWin(newStreak, newInv);
    } else {
      onWin(newStreak, inventoryRef.current);
    }
  }, [
    level,
    winStreak,
    earnedCards,
    earnCard,
    saveProgress,
    updateWinStreak,
    updateInventory,
    onWin,
  ]);

  const handleWinRef = useRef(handleWin);
  handleWinRef.current = handleWin;

  function tryMove(fromShelf: number, fromItem: number, toShelf: number) {
    if (gameStateRef.current !== "playing") return;
    if (fromShelf === toShelf) return;
    const currentShelves = shelvesRef.current;
    // Only allow moving top item (last index)
    if (fromItem !== currentShelves[fromShelf].length - 1) return;
    // Target shelf must not be full
    if (currentShelves[toShelf].length >= SHELF_CAPACITY) return;

    const newShelves = currentShelves.map((s) => [...s]);
    const item = newShelves[fromShelf].splice(fromItem, 1)[0];
    newShelves[toShelf].push(item);

    setHistory((h) => [...h.slice(-20), currentShelves]);
    const afterMatch = applyMatches(newShelves);
    setShelves(afterMatch);
    setMatchHints(new Set());

    if (afterMatch.every((s) => s.length === 0)) {
      setTimeout(() => handleWinRef.current(), 200);
    }
  }

  const tryMoveRef = useRef(tryMove);
  tryMoveRef.current = tryMove;

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      setDragging((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
      );
      let found = -1;
      for (let i = 0; i < shelfRefs.current.length; i++) {
        const el = shelfRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          found = i;
          break;
        }
      }
      setDragTargetShelf(found === -1 ? null : found);
    }

    function onUp(e: PointerEvent) {
      const d = draggingRef.current;
      if (!d) return;
      let targetShelf = -1;
      for (let i = 0; i < shelfRefs.current.length; i++) {
        const el = shelfRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          targetShelf = i;
          break;
        }
      }
      if (targetShelf !== -1 && targetShelf !== d.shelfIdx) {
        tryMoveRef.current(d.shelfIdx, d.itemIdx, targetShelf);
      }
      setDragging(null);
      setDragTargetShelf(null);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  function handleItemPointerDown(
    shelfIdx: number,
    itemIdx: number,
    e: React.PointerEvent,
  ) {
    if (gameState !== "playing") return;
    // Only allow top item
    if (itemIdx !== shelves[shelfIdx].length - 1) return;
    if (hammerMode) {
      const newShelves = shelves.map((s) => [...s]);
      newShelves[shelfIdx].splice(itemIdx, 1);
      const afterMatch = applyMatches(newShelves);
      setHistory((h) => [...h.slice(-20), shelves]);
      setShelves(afterMatch);
      setHammerMode(false);
      const newInv = {
        ...inventoryRef.current,
        hammers: inventoryRef.current.hammers - 1,
      };
      setInventory(newInv);
      updateInventory.mutate(newInv);
      if (afterMatch.every((s) => s.length === 0))
        setTimeout(() => handleWinRef.current(), 200);
      return;
    }
    e.preventDefault();
    const item = shelves[shelfIdx][itemIdx];
    setDragging({ shelfIdx, itemIdx, item, x: e.clientX, y: e.clientY });
    setSelected(null);
  }

  function handleItemClick(shelfIdx: number, itemIdx: number) {
    if (gameState !== "playing" || hammerMode) return;
    if (itemIdx !== shelves[shelfIdx].length - 1) return; // only top
    if (selected === null) {
      setSelected({ shelfIdx, itemIdx });
    } else if (selected.shelfIdx === shelfIdx && selected.itemIdx === itemIdx) {
      setSelected(null);
    } else if (selected.shelfIdx === shelfIdx) {
      setSelected({ shelfIdx, itemIdx });
    } else {
      tryMove(selected.shelfIdx, selected.itemIdx, shelfIdx);
      setSelected(null);
    }
  }

  function handleShelfClick(shelfIdx: number) {
    if (gameState !== "playing" || hammerMode) return;
    if (selected !== null && selected.shelfIdx !== shelfIdx) {
      tryMove(selected.shelfIdx, selected.itemIdx, shelfIdx);
      setSelected(null);
    } else {
      setSelected(null);
    }
  }

  function handleUndo() {
    if (history.length === 0 || gameState !== "playing") return;
    setShelves(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setSelected(null);
    setMatchHints(new Set());
  }

  function handleUseFreeze() {
    if (inventory.timeFreezers <= 0 || frozen) return;
    frozenUntilRef.current = Date.now() + 10000;
    setFrozen(true);
    const newInv = { ...inventory, timeFreezers: inventory.timeFreezers - 1 };
    setInventory(newInv);
    updateInventory.mutate(newInv);
    setTimeout(() => setFrozen(false), 10000);
  }

  function handleUseMatchMaker() {
    if (inventory.matchMakers <= 0) return;
    setMatchHints(computeMatchHints(shelves));
    const newInv = { ...inventory, matchMakers: inventory.matchMakers - 1 };
    setInventory(newInv);
    updateInventory.mutate(newInv);
    setTimeout(() => setMatchHints(new Set()), 5000);
  }

  function handleUseHammer() {
    if (inventory.hammers <= 0 || hammerMode) return;
    setHammerMode(true);
    setSelected(null);
  }

  const timerCritical = timeLeft <= 20;
  const isBoss = level.id % 10 === 0;
  const difficultyLabel = isBoss
    ? "BOSS"
    : level.difficulty === "easy"
      ? "Easy"
      : level.difficulty === "medium"
        ? "Medium"
        : "Hard";
  const difficultyColor = isBoss
    ? "oklch(0.72 0.22 45)"
    : level.difficulty === "easy"
      ? "oklch(0.72 0.18 155)"
      : level.difficulty === "medium"
        ? "oklch(0.75 0.18 75)"
        : "oklch(0.68 0.22 25)";

  const dragMeta = dragging ? ITEM_META[dragging.item] : null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: isBoss
          ? "linear-gradient(160deg, oklch(0.16 0.06 35) 0%, oklch(0.11 0.04 25) 100%)"
          : "linear-gradient(160deg, oklch(0.14 0.04 265) 0%, oklch(0.11 0.03 280) 100%)",
      }}
    >
      {/* Header */}
      <header
        data-ocid="game.panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid oklch(0.28 0.05 265 / 0.5)",
          background: isBoss
            ? "oklch(0.18 0.06 35 / 0.9)"
            : "oklch(0.16 0.04 265 / 0.9)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          data-ocid="game.cancel_button"
          onClick={onGoHome}
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
          ← Home
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "oklch(0.96 0.02 265)",
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
            }}
          >
            Level {level.id}
            {isBoss ? (
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "oklch(0.88 0.22 45)",
                  background: "oklch(0.28 0.1 35 / 0.8)",
                  border: "1px solid oklch(0.72 0.22 45 / 0.6)",
                  borderRadius: 6,
                  padding: "2px 7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                💀 BOSS
              </motion.span>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: difficultyColor,
                  textTransform: "uppercase",
                }}
              >
                {difficultyLabel}
              </span>
            )}
          </div>
          <motion.div
            animate={
              timerCritical
                ? {
                    scale: [1, 1.08, 1],
                    color: ["#ff4444", "#ff8888", "#ff4444"],
                  }
                : { scale: 1 }
            }
            transition={
              timerCritical
                ? { repeat: Number.POSITIVE_INFINITY, duration: 0.8 }
                : {}
            }
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: frozen
                ? "oklch(0.72 0.18 215)"
                : timerCritical
                  ? "oklch(0.65 0.25 25)"
                  : "oklch(0.92 0.02 265)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {frozen ? "❄️ " : ""}
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        <button
          type="button"
          data-ocid="game.link"
          onClick={onGoAlbum}
          style={{
            background: "oklch(0.22 0.05 265 / 0.8)",
            border: "1.5px solid oklch(0.35 0.06 265 / 0.6)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 18,
          }}
          title="Album"
        >
          📚
        </button>
      </header>

      {/* Hammer mode banner */}
      <AnimatePresence>
        {hammerMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "oklch(0.38 0.18 25 / 0.9)",
              textAlign: "center",
              padding: "8px",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            🔨 Hammer Mode — tap top item to remove it
            <button
              type="button"
              onClick={() => setHammerMode(false)}
              style={{
                marginLeft: 12,
                background: "rgba(0,0,0,0.3)",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                padding: "2px 8px",
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tray board */}
      <main
        data-ocid="game.section"
        style={{
          flex: 1,
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {shelves.map((items, shelfIdx) => (
          <Shelf
            // biome-ignore lint/suspicious/noArrayIndexKey: shelf positions are stable
            key={shelfIdx}
            shelfIdx={shelfIdx}
            items={items}
            capacity={SHELF_CAPACITY}
            selected={selected}
            matchHints={matchHints}
            hammerMode={hammerMode}
            onItemClick={handleItemClick}
            onShelfClick={handleShelfClick}
            onItemPointerDown={handleItemPointerDown}
            shelfRef={(el) => {
              shelfRefs.current[shelfIdx] = el;
            }}
            isDragTarget={
              dragTargetShelf === shelfIdx &&
              dragging !== null &&
              dragging.shelfIdx !== shelfIdx
            }
            cleared={items.length === 0 && gameState !== "playing"}
          />
        ))}
      </main>

      {/* Drag ghost */}
      <AnimatePresence>
        {dragging && dragMeta && (
          <motion.div
            initial={{ scale: 1.1, opacity: 0.9 }}
            animate={{ scale: 1.2, opacity: 0.95 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              position: "fixed",
              left: dragging.x - 28,
              top: dragging.y - 28,
              zIndex: 9999,
              pointerEvents: "none",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7))",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: dragMeta.bg,
                border: "2.5px solid rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                boxShadow: `0 0 24px ${dragMeta.accentColor}88`,
              }}
            >
              {dragMeta.icon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div
        style={{
          background: "oklch(0.16 0.04 265 / 0.95)",
          borderTop: "1px solid oklch(0.28 0.05 265 / 0.5)",
          padding: "6px 16px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <motion.button
            type="button"
            data-ocid="game.secondary_button"
            onClick={handleUndo}
            disabled={history.length === 0 || gameState !== "playing"}
            whileHover={history.length > 0 ? { scale: 1.05 } : {}}
            whileTap={history.length > 0 ? { scale: 0.95 } : {}}
            style={{
              background: "oklch(0.22 0.05 265 / 0.8)",
              border: "1.5px solid oklch(0.35 0.06 265 / 0.6)",
              borderRadius: 10,
              padding: "7px 16px",
              cursor: history.length === 0 ? "not-allowed" : "pointer",
              color:
                history.length === 0
                  ? "oklch(0.45 0.04 265)"
                  : "oklch(0.85 0.03 265)",
              fontSize: 13,
              fontWeight: 700,
              opacity: history.length === 0 ? 0.45 : 1,
            }}
          >
            ↩ Undo
          </motion.button>

          <button
            type="button"
            data-ocid="level_select.link"
            onClick={onGoLevelSelect}
            style={{
              background: "oklch(0.22 0.05 265 / 0.8)",
              border: "1.5px solid oklch(0.35 0.06 265 / 0.6)",
              borderRadius: 10,
              padding: "7px 14px",
              cursor: "pointer",
              color: "oklch(0.75 0.04 265)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Levels
          </button>
        </div>

        <PowerUpBar
          timeFreezers={inventory.timeFreezers}
          matchMakers={inventory.matchMakers}
          hammers={inventory.hammers}
          hammerMode={hammerMode}
          frozen={frozen}
          onUseFreeze={handleUseFreeze}
          onUseMatchMaker={handleUseMatchMaker}
          onUseHammer={handleUseHammer}
        />
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameState === "won" && (
          <motion.div
            key="win"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "16px",
              overflowY: "auto",
            }}
            data-ocid="game.modal"
          >
            <motion.div
              initial={{ scale: 0.82, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.2 0.06 265), oklch(0.15 0.04 280))",
                borderRadius: 24,
                padding: "32px 24px",
                maxWidth: 380,
                width: "100%",
                textAlign: "center",
                border: "1.5px solid oklch(0.82 0.18 75 / 0.35)",
                boxShadow:
                  "0 0 40px oklch(0.82 0.18 75 / 0.15), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -8, 5, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{ fontSize: 52, marginBottom: 4 }}
              >
                {bossReward ? "🏆" : "🎉"}
              </motion.div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: bossReward
                    ? "oklch(0.88 0.22 75)"
                    : "oklch(0.82 0.18 75)",
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                {bossReward ? "Boss Defeated!" : "Level Complete!"}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "oklch(0.65 0.05 265)",
                  margin: "0 0 12px",
                }}
              >
                You earned a new element card:
              </p>
              {earnedCardId && <EarnedCardDisplay cardId={earnedCardId} />}
              {bossReward && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  style={{
                    background: "oklch(0.28 0.12 75 / 0.5)",
                    border: "1.5px solid oklch(0.82 0.22 75 / 0.6)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    marginBottom: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "oklch(0.92 0.12 75)",
                  }}
                >
                  💀 Level {level.id} Boss Bonus!{" "}
                  <span style={{ fontWeight: 400 }}>
                    +5 ❄️ Freezes · +3 🔮 Hints · +1 🔨 Hammer
                  </span>
                </motion.div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 16,
                  justifyContent: "center",
                }}
              >
                <motion.button
                  type="button"
                  data-ocid="game.primary_button"
                  onClick={onNextLevel}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 155), oklch(0.42 0.18 155))",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px oklch(0.55 0.22 155 / 0.4)",
                  }}
                >
                  Next Level →
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="game.cancel_button"
                  onClick={onGoLevelSelect}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "12px 16px",
                    background: "oklch(0.24 0.05 265 / 0.8)",
                    border: "1.5px solid oklch(0.38 0.06 265 / 0.6)",
                    borderRadius: 12,
                    color: "oklch(0.78 0.04 265)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Levels
                </motion.button>
              </div>
              <button
                type="button"
                data-ocid="game.link"
                onClick={onGoAlbum}
                style={{
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  color: "oklch(0.62 0.06 265)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                📚 View Album
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState === "lost" && (
          <motion.div
            key="lost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "16px",
            }}
            data-ocid="game.dialog"
          >
            <motion.div
              initial={{ scale: 0.82, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.2 0.06 265), oklch(0.14 0.04 280))",
                borderRadius: 24,
                padding: "36px 28px",
                maxWidth: 340,
                width: "100%",
                textAlign: "center",
                border: "1.5px solid oklch(0.65 0.22 25 / 0.35)",
                boxShadow:
                  "0 0 40px oklch(0.65 0.22 25 / 0.15), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 8 }}>⏰</div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "oklch(0.72 0.2 25)",
                  margin: "0 0 8px",
                }}
              >
                Time&apos;s Up!
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "oklch(0.62 0.05 265)",
                  margin: "0 0 24px",
                }}
              >
                You ran out of time. Better luck next time!
              </p>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "center" }}
              >
                <motion.button
                  type="button"
                  data-ocid="game.primary_button"
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background:
                      "linear-gradient(135deg, oklch(0.58 0.22 25), oklch(0.45 0.2 20))",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="game.cancel_button"
                  onClick={onGoHome}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "12px 16px",
                    background: "oklch(0.24 0.05 265 / 0.8)",
                    border: "1.5px solid oklch(0.38 0.06 265 / 0.6)",
                    borderRadius: 12,
                    color: "oklch(0.78 0.04 265)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

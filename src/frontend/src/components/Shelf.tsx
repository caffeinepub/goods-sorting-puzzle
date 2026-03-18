import { motion } from "motion/react";
import ItemCard from "./ItemCard";

interface ShelfProps {
  shelfIdx: number;
  items: string[];
  capacity?: number;
  selected: { shelfIdx: number; itemIdx: number } | null;
  matchHints: Set<string>;
  hammerMode: boolean;
  onItemClick: (shelfIdx: number, itemIdx: number) => void;
  onShelfClick: (shelfIdx: number) => void;
  onItemPointerDown?: (
    shelfIdx: number,
    itemIdx: number,
    e: React.PointerEvent,
  ) => void;
  shelfRef?: (el: HTMLDivElement | null) => void;
  isDragTarget?: boolean;
  isTarget?: boolean;
  cleared?: boolean;
}

export default function Shelf({
  shelfIdx,
  items,
  capacity = 3,
  selected,
  matchHints,
  hammerMode,
  onItemClick,
  onShelfClick,
  onItemPointerDown,
  shelfRef,
  isDragTarget = false,
  isTarget = false,
  cleared = false,
}: ShelfProps) {
  const isSelectedShelf = selected?.shelfIdx === shelfIdx;
  const canReceive =
    (selected !== null &&
      selected.shelfIdx !== shelfIdx &&
      items.length < capacity) ||
    isDragTarget;

  // Each shelf oscillates independently
  const amplitude = 6;
  const duration = 2.2 + shelfIdx * 0.22;

  // Only the topmost item (last index) is interactable
  const topIdx = items.length - 1;

  // Tray color varies subtly by index for visual depth
  const trayHue = 250 + (shelfIdx % 5) * 12;
  const trayBg = cleared
    ? "oklch(0.22 0.06 155 / 0.5)"
    : (isTarget && canReceive) || isDragTarget
      ? `oklch(0.24 0.08 ${trayHue} / 0.95)`
      : isSelectedShelf
        ? "oklch(0.26 0.08 75 / 0.5)"
        : `oklch(0.19 0.04 ${trayHue} / 0.92)`;

  return (
    <motion.div
      ref={shelfRef}
      layout
      onClick={() => onShelfClick(shelfIdx)}
      initial={{ opacity: 0, x: -24 }}
      animate={{
        opacity: cleared ? 0.4 : 1,
        x: cleared
          ? 0
          : [
              0,
              amplitude * (shelfIdx % 2 === 0 ? 1 : -1),
              0,
              amplitude * (shelfIdx % 2 === 0 ? -1 : 1),
              0,
            ],
      }}
      transition={{
        opacity: { duration: 0.25, delay: shelfIdx * 0.04 },
        x: cleared
          ? { duration: 0.2 }
          : {
              repeat: Number.POSITIVE_INFINITY,
              duration,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: shelfIdx * 0.15,
            },
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "10px 18px",
        background: trayBg,
        borderRadius: 18,
        // Tray-like: thick bottom border, subtle 3-D raised look
        border: cleared
          ? "1.5px solid oklch(0.5 0.18 155 / 0.4)"
          : (isTarget && canReceive) || isDragTarget
            ? `2px solid oklch(0.7 0.2 ${trayHue})`
            : isSelectedShelf
              ? "2px solid oklch(0.8 0.18 75 / 0.7)"
              : `1.5px solid oklch(0.32 0.06 ${trayHue} / 0.7)`,
        borderBottom: cleared
          ? undefined
          : `4px solid oklch(0.14 0.04 ${trayHue} / 0.8)`,
        cursor: canReceive ? "pointer" : "default",
        width: "100%",
        maxWidth: 340,
        flex: "0 0 auto",
        boxShadow: cleared
          ? "none"
          : "inset 0 3px 10px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "visible",
        minHeight: 76,
        gap: 0,
      }}
    >
      {/* Tray inner groove line */}
      {!cleared && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            right: 14,
            height: 2,
            background: `oklch(0.12 0.03 ${trayHue} / 0.55)`,
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Drop target pulse ring */}
      {((canReceive && !cleared) || isDragTarget) && (
        <motion.div
          animate={{ opacity: [0.3, 0.75, 0.3] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.1 }}
          style={{
            position: "absolute",
            inset: 0,
            border: `2px solid oklch(0.8 0.2 ${trayHue} / 0.7)`,
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Items row with overlap stacking */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          flex: 1,
          minHeight: 64,
          justifyContent: "flex-start",
          paddingLeft: 4,
        }}
      >
        {items.map((item, idx) => {
          const isItemSelected =
            selected?.shelfIdx === shelfIdx && selected?.itemIdx === idx;
          const isTopItem = idx === topIdx;
          // Only the top item is accessible; all others are blocked
          const isBlocked = !isTopItem;

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: positional slot
              key={idx}
              style={{
                marginLeft: idx === 0 ? 0 : -20,
                zIndex: idx + 1,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <ItemCard
                itemId={item}
                selected={isItemSelected}
                hint={matchHints.has(item) && isTopItem}
                hammerMode={hammerMode && isTopItem}
                isTop={isTopItem}
                zIndex={idx + 1}
                blocked={isBlocked}
                onClick={(e) => {
                  if (isBlocked) return;
                  e.stopPropagation();
                  onItemClick(shelfIdx, idx);
                }}
                onPointerDown={
                  onItemPointerDown && !isBlocked
                    ? (e) => {
                        e.stopPropagation();
                        onItemPointerDown(shelfIdx, idx, e);
                      }
                    : undefined
                }
              />
            </div>
          );
        })}

        {/* Empty slot indicators — subtle circles, no dashes */}
        {Array.from({ length: Math.max(0, capacity - items.length) }).map(
          (_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: empty slot
              key={`empty-${i}`}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `oklch(0.14 0.03 ${trayHue} / 0.45)`,
                flexShrink: 0,
                marginLeft: items.length === 0 && i === 0 ? 0 : 8,
              }}
            />
          ),
        )}
      </div>

      {/* Item count badge */}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 5,
          fontSize: 9,
          fontWeight: 700,
          color: `oklch(0.45 0.05 ${trayHue})`,
          letterSpacing: "0.05em",
        }}
      >
        {items.length}/{capacity}
      </div>

      {cleared && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          ✅
        </div>
      )}
    </motion.div>
  );
}

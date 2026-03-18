import { motion } from "motion/react";
import { ITEM_META } from "../game/items";

interface ItemCardProps {
  itemId: string;
  selected?: boolean;
  hint?: boolean;
  hammerMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  disabled?: boolean;
  isTop?: boolean;
  zIndex?: number;
  blocked?: boolean;
}

export default function ItemCard({
  itemId,
  selected = false,
  hint = false,
  hammerMode = false,
  onClick,
  onPointerDown,
  disabled = false,
  isTop = false,
  zIndex = 1,
  blocked = false,
}: ItemCardProps) {
  const meta = ITEM_META[itemId];
  if (!meta) return null;

  const isPower = meta.category === "power";

  let borderColor = "rgba(255,255,255,0.22)";
  let glowShadow = "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)";
  if (selected) {
    borderColor = "oklch(0.88 0.2 75)";
    glowShadow =
      "0 0 0 2.5px oklch(0.88 0.2 75), 0 0 18px oklch(0.88 0.2 75 / 0.6)";
  } else if (hint) {
    borderColor = "oklch(0.78 0.2 195)";
    glowShadow =
      "0 0 0 2px oklch(0.78 0.2 195), 0 0 14px oklch(0.78 0.2 195 / 0.5)";
  } else if (hammerMode && !blocked) {
    borderColor = "oklch(0.68 0.22 25)";
    glowShadow =
      "0 0 0 2px oklch(0.68 0.22 25), 0 0 12px oklch(0.68 0.22 25 / 0.5)";
  } else if (isPower) {
    glowShadow = `0 4px 12px rgba(0,0,0,0.5), 0 0 14px ${meta.accentColor}55`;
  }

  return (
    <motion.button
      type="button"
      draggable={false}
      onClick={!blocked ? onClick : undefined}
      onPointerDown={!blocked ? onPointerDown : undefined}
      disabled={disabled || blocked}
      whileHover={disabled || blocked ? {} : { scale: 1.12, y: -5 }}
      whileTap={disabled || blocked ? {} : { scale: 0.92 }}
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: `2.5px solid ${borderColor}`,
        background: meta.bg,
        color: meta.fg,
        position: "relative",
        cursor: blocked ? "not-allowed" : disabled ? "default" : "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: glowShadow,
        overflow: "hidden",
        userSelect: "none",
        flexShrink: 0,
        padding: 0,
        outline: "none",
        zIndex,
        transform: isTop && !blocked ? "translateY(-6px)" : undefined,
        touchAction: "none",
        opacity: blocked ? 0.55 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Center icon */}
      <span
        style={{
          fontSize: 26,
          lineHeight: 1,
          filter: isPower
            ? `drop-shadow(0 0 6px ${meta.accentColor})`
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
        }}
      >
        {meta.icon}
      </span>

      {/* Shine overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28) 0%, transparent 60%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Power glow pulse */}
      {isPower && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.82, 1.06, 0.82] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${meta.accentColor}`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Lock overlay when blocked */}
      {blocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.38)",
            borderRadius: "50%",
            fontSize: 16,
          }}
        >
          🔒
        </div>
      )}

      {/* Hammer overlay */}
      {hammerMode && !blocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(200,50,50,0.35)",
            borderRadius: "50%",
            fontSize: 20,
          }}
        >
          🔨
        </div>
      )}
    </motion.button>
  );
}

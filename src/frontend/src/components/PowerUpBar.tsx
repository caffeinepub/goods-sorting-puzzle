import { motion } from "motion/react";

interface PowerUpBarProps {
  timeFreezers: number;
  matchMakers: number;
  hammers: number;
  hammerMode: boolean;
  frozen: boolean;
  onUseFreeze: () => void;
  onUseMatchMaker: () => void;
  onUseHammer: () => void;
}

function PowerUpBtn({
  icon,
  count,
  label,
  active,
  disabled,
  onClick,
  dataOcid,
}: {
  icon: string;
  count: number;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  dataOcid: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || count === 0}
      data-ocid={dataOcid}
      whileHover={!disabled && count > 0 ? { scale: 1.08, y: -2 } : {}}
      whileTap={!disabled && count > 0 ? { scale: 0.93 } : {}}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "8px 12px",
        borderRadius: 12,
        border: active
          ? "2px solid oklch(0.78 0.22 25)"
          : "1.5px solid oklch(0.35 0.06 265 / 0.7)",
        background: active
          ? "oklch(0.22 0.08 25 / 0.7)"
          : count === 0
            ? "oklch(0.18 0.03 265 / 0.5)"
            : "oklch(0.2 0.05 265 / 0.8)",
        cursor: disabled || count === 0 ? "not-allowed" : "pointer",
        opacity: count === 0 ? 0.45 : 1,
        minWidth: 60,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "oklch(0.92 0.02 265)",
          lineHeight: 1,
        }}
      >
        ×{count}
      </span>
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "oklch(0.62 0.05 265)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

export default function PowerUpBar({
  timeFreezers,
  matchMakers,
  hammers,
  hammerMode,
  frozen,
  onUseFreeze,
  onUseMatchMaker,
  onUseHammer,
}: PowerUpBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      <PowerUpBtn
        icon="❄️"
        count={timeFreezers}
        label="Freeze"
        active={frozen}
        onClick={onUseFreeze}
        dataOcid="game.toggle"
      />
      <PowerUpBtn
        icon="🔮"
        count={matchMakers}
        label="Hint"
        onClick={onUseMatchMaker}
        dataOcid="game.secondary_button"
      />
      <PowerUpBtn
        icon="🔨"
        count={hammers}
        label="Hammer"
        active={hammerMode}
        onClick={onUseHammer}
        dataOcid="game.delete_button"
      />
    </div>
  );
}

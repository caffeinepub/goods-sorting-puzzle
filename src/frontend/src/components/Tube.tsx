import { isTubeComplete } from "../game/gameLogic";
import {
  type BallColor,
  TUBE_CAPACITY,
  type Tube as TubeData,
} from "../game/levels";
import Ball from "./Ball";

interface TubeProps {
  tube: TubeData;
  index: number;
  isSelected: boolean;
  canReceive: boolean;
  onClick: (index: number) => void;
  ballSize?: number;
}

interface BallSlot {
  color: BallColor;
  slotKey: string;
  isTop: boolean;
}

interface EmptySlot {
  slotKey: string;
}

export default function Tube({
  tube,
  index,
  isSelected,
  canReceive,
  onClick,
  ballSize = 44,
}: TubeProps) {
  const complete = isTubeComplete(tube) && tube.length === TUBE_CAPACITY;
  const emptySlotCount = TUBE_CAPACITY - tube.length;
  const gap = 4;
  const padding = 8;
  const tubeHeight = TUBE_CAPACITY * (ballSize + gap) + padding * 2;
  const tubeWidth = ballSize + padding * 2;

  // Pre-compute keyed slot data to avoid map-index keys in JSX
  const ballSlots: BallSlot[] = tube.map((color, i) => ({
    color,
    slotKey: `b${index}-${i}`,
    isTop: i === tube.length - 1,
  }));
  const emptySlots: EmptySlot[] = Array.from(
    { length: emptySlotCount },
    (_, i) => ({
      slotKey: `e${index}-${i}`,
    }),
  );

  let borderStyle = "2px solid rgba(191,211,227,0.45)";
  let boxShadow =
    "inset 0 2px 10px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)";
  let extraClass = "";

  if (complete) {
    borderStyle = "2px solid #3CCB63";
    boxShadow =
      "0 0 10px 4px rgba(60,203,99,0.5), inset 0 2px 10px rgba(0,0,0,0.2)";
    extraClass = "tube-complete";
  } else if (isSelected) {
    borderStyle = "2px solid #F6C21A";
    boxShadow =
      "0 0 14px 4px rgba(246,194,26,0.5), inset 0 2px 10px rgba(0,0,0,0.2)";
    extraClass = "tube-selected";
  } else if (canReceive) {
    borderStyle = "2px solid rgba(47,191,107,0.6)";
    boxShadow =
      "0 0 10px 2px rgba(47,191,107,0.3), inset 0 2px 10px rgba(0,0,0,0.2)";
  }

  return (
    <button
      type="button"
      data-ocid={`tube.item.${index + 1}`}
      onClick={() => onClick(index)}
      className={`relative cursor-pointer select-none transition-transform duration-150 ${extraClass}`}
      style={{
        width: tubeWidth,
        height: tubeHeight + 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        background: "transparent",
        border: "none",
        padding: 0,
        transform: isSelected ? "translateY(-10px) scale(1.06)" : "none",
      }}
    >
      <div
        style={{
          width: tubeWidth,
          height: tubeHeight,
          borderRadius: "0 0 100px 100px",
          background: "rgba(180,210,235,0.10)",
          backdropFilter: "blur(4px)",
          border: borderStyle,
          borderTop: "none",
          boxShadow,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          padding: `${padding}px 0`,
          gap: gap,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {ballSlots.map(({ color, slotKey, isTop }) => (
          <Ball key={slotKey} color={color} size={ballSize} animate={isTop} />
        ))}
        {emptySlots.map(({ slotKey }) => (
          <div
            key={slotKey}
            style={{
              width: ballSize,
              height: ballSize,
              borderRadius: "50%",
              background: "rgba(180,210,235,0.05)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            width: "25%",
            height: "80%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0))",
            borderRadius: "0 0 8px 8px",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          width: tubeWidth + 6,
          height: 10,
          background: "rgba(180,210,235,0.20)",
          borderRadius: "6px 6px 0 0",
          border: borderStyle,
          borderBottom: "none",
          position: "absolute",
          top: 0,
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        }}
      />
    </button>
  );
}

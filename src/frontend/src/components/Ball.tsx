import { BALL_COLORS, type BallColor } from "../game/levels";

interface BallProps {
  color: BallColor;
  size?: number;
  animate?: boolean;
}

export default function Ball({ color, size = 44, animate = false }: BallProps) {
  const hex = BALL_COLORS[color];
  return (
    <div
      className={animate ? "ball-animate-in" : ""}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${hex} 60%, white 40%), ${hex} 60%, color-mix(in srgb, ${hex} 70%, black 30%))`,
        boxShadow:
          "inset -3px -3px 8px rgba(0,0,0,0.35), inset 3px 3px 8px rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.3)",
        flexShrink: 0,
      }}
    />
  );
}

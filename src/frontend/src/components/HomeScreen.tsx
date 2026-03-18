import { motion } from "motion/react";

const PARTICLES = [
  { icon: "♦", left: 10, top: 15 },
  { icon: "🔥", left: 21, top: 32 },
  { icon: "💧", left: 32, top: 49 },
  { icon: "🌿", left: 43, top: 15 },
  { icon: "💨", left: 54, top: 64 },
  { icon: "7", left: 65, top: 28 },
  { icon: "♦", left: 76, top: 45 },
  { icon: "⚡", left: 87, top: 18 },
];

interface HomeScreenProps {
  onPlay: () => void;
  onLevels: () => void;
  onAlbum: () => void;
  winStreak: number;
  collectedCards: number;
}

export default function HomeScreen({
  onPlay,
  onLevels,
  onAlbum,
  winStreak,
  collectedCards,
}: HomeScreenProps) {
  return (
    <div
      data-ocid="home.page"
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, oklch(0.14 0.04 265) 0%, oklch(0.11 0.03 280) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating background particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative list
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.4,
          }}
          style={{
            position: "absolute",
            fontSize: 28,
            left: `${p.left}%`,
            top: `${p.top}%`,
            pointerEvents: "none",
            zIndex: 0,
            filter: "blur(1px)",
          }}
        >
          {p.icon}
        </motion.div>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.7 }}
        >
          <div style={{ fontSize: 64, marginBottom: 0, lineHeight: 1 }}>🃏</div>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              margin: "8px 0 4px",
              letterSpacing: "-0.04em",
              background:
                "linear-gradient(135deg, oklch(0.92 0.02 265) 0%, oklch(0.78 0.18 75) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SORT IT!
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "oklch(0.58 0.06 265)",
              margin: "0 0 32px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Match · Sort · Collect
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "oklch(0.2 0.05 265 / 0.8)",
              border: "1px solid oklch(0.35 0.06 265 / 0.5)",
              borderRadius: 12,
              padding: "10px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "oklch(0.82 0.18 75)",
              }}
            >
              {winStreak}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "oklch(0.55 0.05 265)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              🔥 Streak
            </div>
          </div>
          <div
            style={{
              background: "oklch(0.2 0.05 265 / 0.8)",
              border: "1px solid oklch(0.35 0.06 265 / 0.5)",
              borderRadius: 12,
              padding: "10px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "oklch(0.72 0.18 250)",
              }}
            >
              {collectedCards}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "oklch(0.55 0.05 265)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              📚 Cards
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <motion.button
            type="button"
            data-ocid="home.primary_button"
            onClick={onPlay}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "18px",
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 155), oklch(0.42 0.18 150))",
              border: "none",
              borderRadius: 16,
              color: "#fff",
              fontSize: 18,
              fontWeight: 900,
              cursor: "pointer",
              letterSpacing: "0.04em",
              boxShadow: "0 6px 24px oklch(0.55 0.22 155 / 0.45)",
            }}
          >
            ▶ PLAY
          </motion.button>

          <div style={{ display: "flex", gap: 12 }}>
            <motion.button
              type="button"
              data-ocid="home.secondary_button"
              onClick={onLevels}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "14px",
                background: "oklch(0.2 0.05 265 / 0.8)",
                border: "1.5px solid oklch(0.38 0.08 265 / 0.6)",
                borderRadius: 14,
                color: "oklch(0.82 0.04 265)",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              📋 Levels
            </motion.button>

            <motion.button
              type="button"
              data-ocid="home.link"
              onClick={onAlbum}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "14px",
                background: "oklch(0.2 0.05 265 / 0.8)",
                border: "1.5px solid oklch(0.38 0.08 265 / 0.6)",
                borderRadius: 14,
                color: "oklch(0.72 0.18 250)",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              📚 Album
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 40 }}
        >
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: "oklch(0.4 0.03 265)",
              textDecoration: "none",
            }}
          >
            © {new Date().getFullYear()} · Built with ❤️ using caffeine.ai
          </a>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "motion/react";
import { ELEMENT_CARDS } from "../game/elementCards";

interface AlbumProps {
  earnedCards: string[];
  onBack: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "oklch(0.72 0.05 265)",
  rare: "oklch(0.72 0.18 250)",
  legendary: "oklch(0.78 0.18 75)",
};

export default function Album({ earnedCards, onBack }: AlbumProps) {
  const earned = new Set(earnedCards);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, oklch(0.14 0.04 265) 0%, oklch(0.11 0.03 280) 100%)",
        display: "flex",
        flexDirection: "column",
      }}
      data-ocid="album.page"
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
          data-ocid="album.cancel_button"
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
            📚 Element Album
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "oklch(0.58 0.05 265)",
              margin: 0,
            }}
          >
            {earned.size} / {ELEMENT_CARDS.length} cards collected
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ padding: "12px 16px 0" }}>
        <div
          style={{
            height: 6,
            borderRadius: 4,
            background: "oklch(0.22 0.04 265)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(earned.size / ELEMENT_CARDS.length) * 100}%`,
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, oklch(0.55 0.22 155), oklch(0.65 0.22 75))",
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Cards grid */}
      <main
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          {ELEMENT_CARDS.map((card, i) => {
            const isEarned = earned.has(card.id);
            return (
              <motion.div
                key={card.id}
                data-ocid={`album.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  background: isEarned
                    ? `linear-gradient(145deg, ${card.color}66, oklch(0.18 0.05 265))`
                    : "oklch(0.18 0.03 265)",
                  borderRadius: 14,
                  padding: "16px 12px",
                  textAlign: "center",
                  border: isEarned
                    ? `1.5px solid ${card.color}88`
                    : "1.5px solid oklch(0.28 0.04 265 / 0.5)",
                  boxShadow: isEarned ? `0 0 16px ${card.color}33` : "none",
                  opacity: isEarned ? 1 : 0.5,
                  filter: isEarned ? "none" : "grayscale(1)",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {isEarned ? card.symbol : "❓"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: isEarned
                      ? "oklch(0.94 0.02 265)"
                      : "oklch(0.45 0.03 265)",
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {isEarned ? card.name : "???"}
                </div>
                {isEarned && (
                  <>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color:
                          RARITY_COLORS[card.rarity] ?? "oklch(0.65 0.05 265)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      }}
                    >
                      {card.rarity}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.55)",
                        background: "rgba(0,0,0,0.25)",
                        borderRadius: 6,
                        padding: "2px 6px",
                        display: "inline-block",
                        marginBottom: 4,
                      }}
                    >
                      {card.power}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.4)",
                        fontStyle: "italic",
                        lineHeight: 1.3,
                      }}
                    >
                      {card.description}
                    </div>
                  </>
                )}
                {!isEarned && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "oklch(0.42 0.03 265)",
                      marginTop: 4,
                    }}
                  >
                    🔒 Locked
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "12px",
          borderTop: "1px solid oklch(0.22 0.04 265 / 0.5)",
        }}
      >
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: "oklch(0.42 0.03 265)" }}
        >
          © {new Date().getFullYear()} · Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

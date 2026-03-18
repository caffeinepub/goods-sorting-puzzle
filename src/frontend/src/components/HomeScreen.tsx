import { LayoutGrid, Play } from "lucide-react";
import { motion } from "motion/react";

const DEMO_TUBES = [
  { id: "demo-1", colors: ["#E84B4B", "#E84B4B", "#2D7FF0", "#F6C21A"] },
  { id: "demo-2", colors: ["#3CCB63", "#3CCB63", "#3CCB63", "#3CCB63"] },
  { id: "demo-3", colors: ["#F28A1A", "#9B5DE5", "#F28A1A", "#9B5DE5"] },
] as const;

interface HomeScreenProps {
  onPlay: () => void;
  onLevels: () => void;
}

export default function HomeScreen({ onPlay, onLevels }: HomeScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      data-ocid="home.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <div className="flex justify-center gap-3 mb-6">
          {DEMO_TUBES.map((tube, ti) => (
            <motion.div
              key={tube.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + ti * 0.12, duration: 0.5 }}
              style={{
                width: 48,
                height: 140,
                borderRadius: "0 0 100px 100px",
                background: "rgba(180,210,235,0.12)",
                border: "2px solid rgba(180,210,235,0.4)",
                borderTop: "none",
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
                padding: "6px 0",
                gap: 3,
              }}
            >
              {tube.colors.map((c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static demo data, order never changes
                <div
                  key={`${tube.id}-ball-${i}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${c} 60%, white 40%), ${c})`,
                    boxShadow:
                      "inset -2px -2px 6px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
                    flexShrink: 0,
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>

        <h1
          className="text-6xl font-black tracking-tight text-white mb-2"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          Sort It!
        </h1>
        <p
          className="text-base font-medium"
          style={{ color: "rgba(180,210,235,0.7)" }}
        >
          Sort the colored balls into matching tubes
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <button
          type="button"
          data-ocid="home.primary_button"
          onClick={onPlay}
          className="btn-hover flex items-center justify-center gap-3 py-4 rounded-full font-bold text-lg text-white"
          style={{
            background: "#2FBF6B",
            boxShadow: "0 6px 24px rgba(47,191,107,0.45)",
          }}
        >
          <Play size={22} fill="white" />
          Play
        </button>
        <button
          type="button"
          data-ocid="home.secondary_button"
          onClick={onLevels}
          className="btn-hover flex items-center justify-center gap-3 py-4 rounded-full font-bold text-lg"
          style={{
            background: "rgba(180,210,235,0.15)",
            border: "1.5px solid rgba(180,210,235,0.35)",
            color: "#e0efff",
          }}
        >
          <LayoutGrid size={20} />
          Levels
        </button>
      </motion.div>
    </div>
  );
}

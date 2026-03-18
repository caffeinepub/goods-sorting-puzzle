export type BallColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "pink";

export type Tube = BallColor[];

export interface LevelData {
  id: number;
  tubes: Tube[];
  description: string;
}

export const TUBE_CAPACITY = 4;

export const BALL_COLORS: Record<BallColor, string> = {
  red: "#E84B4B",
  blue: "#2D7FF0",
  green: "#3CCB63",
  yellow: "#F6C21A",
  orange: "#F28A1A",
  purple: "#9B5DE5",
  pink: "#F72585",
};

export const BALL_SHADOW_COLORS: Record<BallColor, string> = {
  red: "rgba(232,75,75,0.6)",
  blue: "rgba(45,127,240,0.6)",
  green: "rgba(60,203,99,0.6)",
  yellow: "rgba(246,194,26,0.6)",
  orange: "rgba(242,138,26,0.6)",
  purple: "rgba(155,93,229,0.6)",
  pink: "rgba(247,37,133,0.6)",
};

export const LEVELS: LevelData[] = [
  {
    id: 1,
    description: "2 colors · Easy warmup",
    tubes: [["red", "red", "blue", "blue"], ["blue", "red", "red", "blue"], []],
  },
  {
    id: 2,
    description: "2 colors · Fully mixed",
    tubes: [["blue", "red", "blue", "red"], ["red", "blue", "red", "blue"], []],
  },
  {
    id: 3,
    description: "3 colors · Getting tricky",
    tubes: [
      ["red", "green", "blue", "red"],
      ["blue", "red", "green", "blue"],
      ["green", "blue", "red", "green"],
      [],
    ],
  },
  {
    id: 4,
    description: "3 colors · Two empty tubes",
    tubes: [
      ["orange", "red", "green", "orange"],
      ["green", "orange", "red", "green"],
      ["red", "green", "orange", "red"],
      [],
      [],
    ],
  },
  {
    id: 5,
    description: "4 colors · Mind the order",
    tubes: [
      ["yellow", "red", "green", "blue"],
      ["blue", "yellow", "red", "green"],
      ["green", "blue", "yellow", "red"],
      ["red", "green", "blue", "yellow"],
      [],
      [],
    ],
  },
  {
    id: 6,
    description: "4 colors · Cycle breaker",
    tubes: [
      ["red", "blue", "yellow", "green"],
      ["green", "red", "blue", "yellow"],
      ["yellow", "green", "red", "blue"],
      ["blue", "yellow", "green", "red"],
      [],
      [],
    ],
  },
  {
    id: 7,
    description: "5 colors · Rising challenge",
    tubes: [
      ["red", "blue", "green", "yellow"],
      ["orange", "red", "blue", "green"],
      ["yellow", "orange", "red", "blue"],
      ["green", "yellow", "orange", "red"],
      ["blue", "green", "yellow", "orange"],
      [],
      [],
    ],
  },
  {
    id: 8,
    description: "5 colors · Deep shuffle",
    tubes: [
      ["orange", "green", "blue", "red"],
      ["yellow", "orange", "green", "blue"],
      ["red", "yellow", "orange", "green"],
      ["blue", "red", "yellow", "orange"],
      ["green", "blue", "red", "yellow"],
      [],
      [],
    ],
  },
  {
    id: 9,
    description: "6 colors · Six-way tangle",
    tubes: [
      ["red", "blue", "green", "yellow"],
      ["purple", "red", "blue", "green"],
      ["orange", "purple", "red", "blue"],
      ["green", "orange", "purple", "red"],
      ["blue", "green", "orange", "purple"],
      ["yellow", "blue", "green", "orange"],
      [],
      [],
    ],
  },
  {
    id: 10,
    description: "6 colors · Master mix",
    tubes: [
      ["blue", "purple", "orange", "red"],
      ["green", "blue", "purple", "orange"],
      ["yellow", "green", "blue", "purple"],
      ["red", "yellow", "green", "blue"],
      ["orange", "red", "yellow", "green"],
      ["purple", "orange", "red", "yellow"],
      [],
      [],
    ],
  },
  {
    id: 11,
    description: "7 colors · Rainbow chaos",
    tubes: [
      ["red", "blue", "green", "yellow"],
      ["purple", "orange", "pink", "red"],
      ["blue", "green", "yellow", "purple"],
      ["orange", "pink", "red", "blue"],
      ["green", "yellow", "purple", "orange"],
      ["pink", "red", "blue", "green"],
      ["yellow", "purple", "orange", "pink"],
      [],
      [],
    ],
  },
  {
    id: 12,
    description: "7 colors · Ultimate sort",
    tubes: [
      ["pink", "orange", "yellow", "red"],
      ["blue", "pink", "orange", "yellow"],
      ["green", "blue", "pink", "orange"],
      ["purple", "green", "blue", "pink"],
      ["red", "purple", "green", "blue"],
      ["yellow", "red", "purple", "green"],
      ["orange", "yellow", "red", "purple"],
      [],
      [],
    ],
  },
];

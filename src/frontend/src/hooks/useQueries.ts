import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface ProgressData {
  firstUnbeatenLevel: number;
  winStreak: number;
  collectedCards: string[];
  inventory: {
    timeFreezers: number;
    matchMakers: number;
    hammers: number;
  };
  bestTimes: Map<number, number>;
}

export function useGameProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<ProgressData>({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor)
        return {
          firstUnbeatenLevel: 1,
          winStreak: 0,
          collectedCards: [],
          inventory: { timeFreezers: 0, matchMakers: 0, hammers: 0 },
          bestTimes: new Map(),
        };
      const p = await actor.getProgress();
      const bestTimes = new Map<number, number>();
      for (const [l, t] of p.bestTimes) {
        bestTimes.set(Number(l), Number(t));
      }
      return {
        firstUnbeatenLevel: Number(p.firstUnbeatenLevel),
        winStreak: Number(p.winStreak),
        collectedCards: p.collectedCards,
        inventory: {
          timeFreezers: Number(p.inventory.timeFreezers),
          matchMakers: Number(p.inventory.matchMakers),
          hammers: Number(p.inventory.hammers),
        },
        bestTimes,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      level,
      seconds,
    }: {
      level: number;
      seconds: number;
    }) => {
      if (!actor) return;
      await actor.saveProgress(BigInt(level), BigInt(seconds));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useEarnCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!actor) return;
      await actor.earnCard(cardId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useUpdateWinStreak() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newStreak: number) => {
      if (!actor) return;
      await actor.updateWinStreak(BigInt(newStreak));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useResetWinStreak() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.resetWinStreak();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useUpdateInventory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inv: {
      timeFreezers: number;
      matchMakers: number;
      hammers: number;
    }) => {
      if (!actor) return;
      await actor.updateInventory(
        BigInt(inv.timeFreezers),
        BigInt(inv.matchMakers),
        BigInt(inv.hammers),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface GameProgress {
  currentLevel: number;
  bestMoves: Map<number, number>;
}

export function useGameProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<GameProgress>({
    queryKey: ["gameProgress"],
    queryFn: async () => {
      if (!actor) return { currentLevel: 1, bestMoves: new Map() };
      const result = await actor.getProgress();
      const bestMoves = new Map<number, number>();
      for (const [lvl, moves] of result.bestMoves) {
        bestMoves.set(Number(lvl), Number(moves));
      }
      return {
        currentLevel: Number(result.currentLevel),
        bestMoves,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ level, moves }: { level: number; moves: number }) => {
      if (!actor) return;
      await actor.saveProgress(BigInt(level), BigInt(moves));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameProgress"] });
    },
  });
}

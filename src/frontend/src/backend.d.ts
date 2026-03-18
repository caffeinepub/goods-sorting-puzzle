import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    getCurrentLevel(): Promise<bigint>;
    getProgress(): Promise<{
        bestMoves: Array<[bigint, bigint]>;
        currentLevel: bigint;
    }>;
    saveProgress(level: bigint, moves: bigint): Promise<void>;
}

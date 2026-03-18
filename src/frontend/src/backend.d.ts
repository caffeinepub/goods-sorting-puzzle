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
    earnCard(cardId: string): Promise<void>;
    getCardAlbum(): Promise<Array<string>>;
    getProgress(): Promise<{
        bestTimes: Array<[bigint, bigint]>;
        collectedCards: Array<string>;
        inventory: {
            matchMakers: bigint;
            hammers: bigint;
            timeFreezers: bigint;
        };
        winStreak: bigint;
        firstUnbeatenLevel: bigint;
    }>;
    resetWinStreak(): Promise<void>;
    saveProgress(level: bigint, seconds: bigint): Promise<void>;
    updateInventory(timeFreezers: bigint, matchMakers: bigint, hammers: bigint): Promise<void>;
    updateWinStreak(newStreak: bigint): Promise<void>;
}

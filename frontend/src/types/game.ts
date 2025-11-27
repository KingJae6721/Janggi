import type { Move } from "./move";

// 게임 데이터
export interface Game {
    id: number;
    player1: string;
    player2: string;
    winner?: string;
    startedAt: string;
    endedAt?: string;
    moves?: Move[];
}

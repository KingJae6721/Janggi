export interface Piece {
    type: '차' | '마' | '상' | '포' | '졸' | '왕';
    team: 'red' | 'blue';
    position: {
        x: number;
        y: number;
    };
}
export declare class GameService {
    private board;
    constructor();
    initializeBoard(): void;
    getBoard(): Piece[];
    movePiece(from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }): boolean;
}

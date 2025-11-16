import { GameService, Piece } from './game.service';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getBoard(): Piece[];
    movePiece(move: {
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
    }): {
        success: boolean;
        board: Piece[];
    };
}

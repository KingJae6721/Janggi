import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Move } from './move.entity';
import { Repository } from 'typeorm';
import {
  JanggiRulesService,
  PieceData,
  Position,
} from './janggi-rules.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    private readonly janggiRulesService: JanggiRulesService,
  ) { }

  /** 초기 말 배치 */
  private initializeBoard(): PieceData[] {
    return [
      // cho (위쪽)
      { type: '차', team: 'cho', x: 0, y: 0 },
      { type: '상', team: 'cho', x: 1, y: 0 },
      { type: '마', team: 'cho', x: 2, y: 0 },
      { type: '사', team: 'cho', x: 3, y: 0 },
      { type: '왕', team: 'cho', x: 4, y: 1 },
      { type: '사', team: 'cho', x: 5, y: 0 },
      { type: '마', team: 'cho', x: 6, y: 0 },
      { type: '상', team: 'cho', x: 7, y: 0 },
      { type: '차', team: 'cho', x: 8, y: 0 },

      { type: '포', team: 'cho', x: 1, y: 2 },
      { type: '포', team: 'cho', x: 7, y: 2 },
      { type: '졸', team: 'cho', x: 0, y: 3 },
      { type: '졸', team: 'cho', x: 2, y: 3 },
      { type: '졸', team: 'cho', x: 4, y: 3 },
      { type: '졸', team: 'cho', x: 6, y: 3 },
      { type: '졸', team: 'cho', x: 8, y: 3 },

      // han (아래쪽)
      { type: '차', team: 'han', x: 0, y: 9 },
      { type: '마', team: 'han', x: 2, y: 9 },
      { type: '상', team: 'han', x: 1, y: 9 },
      { type: '사', team: 'han', x: 3, y: 9 },
      { type: '왕', team: 'han', x: 4, y: 8 },
      { type: '사', team: 'han', x: 5, y: 9 },
      { type: '마', team: 'han', x: 6, y: 9 },
      { type: '상', team: 'han', x: 7, y: 9 },
      { type: '차', team: 'han', x: 8, y: 9 },

      { type: '포', team: 'han', x: 1, y: 7 },
      { type: '포', team: 'han', x: 7, y: 7 },
      { type: '졸', team: 'han', x: 0, y: 6 },
      { type: '졸', team: 'han', x: 2, y: 6 },
      { type: '졸', team: 'han', x: 4, y: 6 },
      { type: '졸', team: 'han', x: 6, y: 6 },
      { type: '졸', team: 'han', x: 8, y: 6 },
    ];
  }

  /** 이동 기록을 보드에 적용 */
  private applyMovesToBoard(moves: Move[]): PieceData[] {
    const board = this.initializeBoard();

    moves.forEach((move) => {
      const piece = board.find((p) => p.x === move.fromX && p.y === move.fromY);
      if (piece) {
        piece.x = move.toX;
        piece.y = move.toY;
      }
      // 잡힌 기물 제거
      const capturedIndex = board.findIndex(
        (p) => p.x === move.toX && p.y === move.toY && p !== piece,
      );
      if (capturedIndex !== -1) {
        board.splice(capturedIndex, 1);
      }
    });

    return board;
  }

  /** 현재 보드 상태 반환 */
  async getBoard(gameId: number): Promise<PieceData[]> {
    const moves = await this.getMovesByGame(gameId);
    console.log(moves);
    return this.applyMovesToBoard(moves);
  }

  /** 이동 가능한 위치 조회 */
  async getPossibleMovesForGame(
    gameId: number,
    from: { x: number; y: number },
  ): Promise<Position[]> {
    const board = await this.getBoard(gameId);
    const piece = board.find((p) => p.x == from.x && p.y == from.y);
    console.log(`기물!!!!---`, piece);
    console.log(`보드!!!!---`, board);
    if (!piece) {
      console.log(`기물이 없습니다`, piece);
      return [];
    }
    return this.janggiRulesService.getLegalMoves(piece, board);
  }

  /** 이동 검증 */
  async validateMoveForGame(
    gameId: number,
    from: { x: number; y: number },
    to: { x: number; y: number },
  ): Promise<{ valid: boolean; message?: string }> {
    const board = await this.getBoard(gameId);
    const piece = board.find((p) => p.x === from.x && p.y === from.y);
    if (!piece)
      return { valid: false, message: '해당 위치에 기물이 없습니다.' };

    const legalMoves = this.janggiRulesService.getLegalMoves(piece, board);
    const isLegal = legalMoves.some((pos) => pos.x === to.x && pos.y === to.y);

    if (!isLegal) return { valid: false, message: '유효하지 않은 이동입니다.' };
    return { valid: true };
  }

  /** 게임 생성 */
  async createGame(player1: string, player2: string): Promise<Game> {
    const game = this.gameRepository.create({ player1, player2 });
    return await this.gameRepository.save(game);
  }

  /** 게임 종료 */
  async endGame(gameId: number, winner: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    game.endedAt = new Date();
    game.winner = winner;
    return await this.gameRepository.save(game);
  }

  /** 플레이어별 게임 조회 */
  async getGamesByPlayer(name: string): Promise<Game[]> {
    return this.gameRepository.find({
      where: [{ player1: name }, { player2: name }],
      order: { startedAt: 'DESC' },
    });
  }

  /** 게임별 이동 기록 조회 */
  async getMovesByGame(gameId: number): Promise<Move[]> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['moves'],
    });
    return game?.moves ?? [];
  }

  /** 이동 기록 추가 */
  async addMove(gameId: number, moveData: Partial<Move>): Promise<Move> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    const move = this.moveRepository.create({ ...moveData, game });
    return await this.moveRepository.save(move);
  }
}

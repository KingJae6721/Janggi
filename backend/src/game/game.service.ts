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

export interface Piece {
  type: '차' | '마' | '상' | '포' | '졸' | '왕' | '사';
  team: 'han' | 'cho';
  position: { x: number; y: number };
}

@Injectable()
export class GameService {
  private board: Piece[] = []; // 현재 게임 상태 저장

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    private readonly janggiRulesService: JanggiRulesService,
  ) {
    this.initializeBoard();
  }

  // 초기 말 배치
  initializeBoard() {
    this.board = [
      //han
      { type: '차', team: 'han', position: { x: 0, y: 0 } },
      { type: '마', team: 'han', position: { x: 1, y: 0 } },
      { type: '상', team: 'han', position: { x: 2, y: 0 } },
      { type: '사', team: 'han', position: { x: 3, y: 0 } },
      { type: '왕', team: 'han', position: { x: 4, y: 0 } },
      { type: '사', team: 'han', position: { x: 5, y: 0 } },
      { type: '상', team: 'han', position: { x: 2, y: 0 } },
      { type: '마', team: 'han', position: { x: 1, y: 0 } },
      { type: '차', team: 'han', position: { x: 8, y: 0 } },
      { type: '포', team: 'han', position: { x: 1, y: 2 } },
      { type: '포', team: 'han', position: { x: 7, y: 2 } },
      { type: '졸', team: 'han', position: { x: 0, y: 3 } },
      { type: '졸', team: 'han', position: { x: 2, y: 3 } },
      { type: '졸', team: 'han', position: { x: 4, y: 3 } },
      { type: '졸', team: 'han', position: { x: 4, y: 3 } },
      { type: '졸', team: 'han', position: { x: 6, y: 3 } },
      { type: '졸', team: 'han', position: { x: 8, y: 3 } },

      //cho
      { type: '차', team: 'cho', position: { x: 0, y: 9 } },
      { type: '마', team: 'cho', position: { x: 1, y: 9 } },
      { type: '상', team: 'cho', position: { x: 2, y: 9 } },
      { type: '사', team: 'cho', position: { x: 3, y: 9 } },
      { type: '왕', team: 'cho', position: { x: 4, y: 9 } },
      { type: '사', team: 'cho', position: { x: 5, y: 9 } },
      { type: '상', team: 'cho', position: { x: 2, y: 9 } },
      { type: '마', team: 'cho', position: { x: 1, y: 9 } },
      { type: '차', team: 'cho', position: { x: 8, y: 9 } },
      { type: '포', team: 'cho', position: { x: 1, y: 7 } },
      { type: '포', team: 'cho', position: { x: 7, y: 7 } },
      { type: '졸', team: 'cho', position: { x: 0, y: 6 } },
      { type: '졸', team: 'cho', position: { x: 2, y: 6 } },
      { type: '졸', team: 'cho', position: { x: 4, y: 6 } },
      { type: '졸', team: 'cho', position: { x: 4, y: 6 } },
      { type: '졸', team: 'cho', position: { x: 6, y: 6 } },
      { type: '졸', team: 'cho', position: { x: 8, y: 6 } },
    ];
  }

  // 현재 보드 상태 반환
  getBoard(): Piece[] {
    return this.board;
  }

  // Piece를 PieceData로 변환
  private convertToPieceData(pieces: Piece[]): PieceData[] {
    return pieces.map((p) => ({
      type: p.type,
      team: p.team,
      x: p.position.x,
      y: p.position.y,
    }));
  }

  // 이동 가능한 위치 조회
  getPossibleMovesForPiece(
    from: { x: number; y: number },
    board?: PieceData[],
  ): Position[] {
    const currentBoard = board || this.convertToPieceData(this.board);
    const piece = currentBoard.find((p) => p.x === from.x && p.y === from.y);

    if (!piece) return [];

    return this.janggiRulesService.getLegalMoves(piece, currentBoard);
  }

  // 이동 검증
  validateMove(
    from: { x: number; y: number },
    to: { x: number; y: number },
    board?: PieceData[],
  ): { valid: boolean; message?: string } {
    const currentBoard = board || this.convertToPieceData(this.board);
    const piece = currentBoard.find((p) => p.x === from.x && p.y === from.y);

    if (!piece) {
      return { valid: false, message: '해당 위치에 기물이 없습니다.' };
    }

    const legalMoves = this.janggiRulesService.getLegalMoves(
      piece,
      currentBoard,
    );
    const isLegal = legalMoves.some((pos) => pos.x === to.x && pos.y === to.y);

    if (!isLegal) {
      return { valid: false, message: '유효하지 않은 이동입니다.' };
    }

    return { valid: true };
  }

  // 말 이동 처리
  movePiece(
    from: { x: number; y: number },
    to: { x: number; y: number },
  ): boolean {
    const validation = this.validateMove(from, to);

    if (!validation.valid) {
      return false;
    }

    const piece = this.board.find(
      (p) => p.position.x === from.x && p.position.y === from.y,
    );

    if (!piece) return false;

    piece.position = to;
    return true;
  }

  //game 테이블 삽입
  async createGame(player1: string, player2: string): Promise<Game> {
    //TypeORM의 create() 메서드는 엔티티 객체를 메모리 상에서 생성
    const game = this.gameRepository.create({ player1, player2 });

    //save()는 엔티티 객체를 실제 데이터베이스에 INSERT
    //동시에 DB에 저장된 엔티티 전체를 반환
    return await this.gameRepository.save(game);
  }

  //종료 시 실행
  async endGame(gameId: number, winner: string): Promise<Game> {
    //게임종료시 winner 업데이트
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    game.endedAt = new Date();
    game.winner = winner;

    return await this.gameRepository.save(game);
  }

  async getGamesByPlayer(name: string): Promise<Game[]> {
    return this.gameRepository.find({
      where: [{ player1: name }, { player2: name }],
      order: { startedAt: 'DESC' },
    });
  }

  //gameId로 검색
  async getMovesByGame(gameId: number): Promise<Move[]> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['moves'],
    });

    return game?.moves ?? [];
    //??은 널 병합 연산자
    //앞의 값(game?.moves)이 null 또는 undefined일 경우, 대신 [](빈 배열)을 반환
  }

  //이동한 로그 처리
  //Partial<move>를 쓰면 move엔티티의 일부 속성만 받을 수 있다는 뜻
  async addMove(gameId: number, moveData: Partial<Move>): Promise<Move> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    //TYPEORM이 객체 관계를 기반으로 매핑해서 game에서 id만 추출한다고 함
    const move = this.moveRepository.create({ ...moveData, game });
    return await this.moveRepository.save(move);
  }
}

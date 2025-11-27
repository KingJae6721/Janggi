import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { Move } from './move.entity';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // 현재 보드 상태 조회
  @Get('boards')
  getBoard() {
    return this.gameService.getBoard();
  }

  // 새 게임 생성
  @Post()
  async createGame(
    @Body('player1') player1: string,
    @Body('player2') player2: string,
  ): Promise<Game> {
    return this.gameService.createGame(player1, player2);
  }

  // 게임 종료
  @Put(':id/end')
  async endGame(
    @Param('id') id: number,
    @Body('winner') winner: string,
  ): Promise<Game> {
    return this.gameService.endGame(id, winner);
  }

  @Get('players/:name')
  async getGamesByPlayer(@Param('name') name: string): Promise<Game[]> {
    return this.gameService.getGamesByPlayer(name);
  }

  // 특정 게임의 이동 기록 조회
  @Get(':id/moves')
  async getMoves(@Param('id') id: number): Promise<Move[]> {
    return this.gameService.getMovesByGame(id);
  }

  // 이동 기록 추가
  @Post(':id/moves')
  async addMove(
    @Param('id') id: number,
    @Body() moveData: Partial<Move>,
  ): Promise<Move> {
    return this.gameService.addMove(id, moveData);
  }

  // 말 이동 처리 (단순히 보드 상태 업데이트)
  @Post('moves')
  movePiece(
    @Body('from') from: { x: number; y: number },
    @Body('to') to: { x: number; y: number },
  ): boolean {
    return this.gameService.movePiece(from, to);
  }

  // 이동 검증
  @Post('validate-moves')
  validateMove(
    @Body('from') from: { x: number; y: number },
    @Body('to') to: { x: number; y: number },
    @Body('board') board?: any[],
  ): { valid: boolean; message?: string } {
    return this.gameService.validateMove(from, to, board);
  }

  // 이동 가능한 위치 조회
  @Post('possible-moves')
  getPossibleMoves(
    @Body('from') from: { x: number; y: number },
    @Body('board') board?: any[],
  ) {
    return this.gameService.getPossibleMovesForPiece(from, board);
  }
}
// POST /games -> 새 게임 생성
// GET /games -> 전체 게임 목록 (옵션: ?player=name)
// GET /games/:gameId -> 단일 게임 정보 (보드 포함)
// GET /games/:gameId/board -> 해당 게임의 보드 상태
// PATCH /games/:gameId -> 게임 상태 업데이트(예: 종료)
// GET /games/:gameId/moves -> 이동 기록 조회
// POST /games/:gameId/moves -> 이동 추가(즉, 기물 이동)
// POST /games/:gameId/moves/validate -> 서버 측 이동 검증(또는 GET 대안)
// GET /games/:gameId/pieces/:x/:y/possible-moves -> 특정 말의 가능한 이동 조회

import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { Move } from './move.entity';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // 현재 보드 상태 조회
  @Get('board')
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
  @Post('move')
  movePiece(
    @Body('from') from: { x: number; y: number },
    @Body('to') to: { x: number; y: number },
  ): boolean {
    return this.gameService.movePiece(from, to);
  }
}

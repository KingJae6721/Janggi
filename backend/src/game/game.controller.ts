import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService, Piece } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // 현재 보드 상태 조회
  @Get('state')
  getBoard(): Piece[] {
    return this.gameService.getBoard();
  }

  @Post(':id/end')
  async endGame(@Param('id') id: number, @Body() body: { winner: string }) {
    return this.gameService.endGame(id, body.winner);
  }

  // 말 이동 요청
  @Post('move')
  movePiece(
    @Body()
    move: {
      from: { x: number; y: number };
      to: { x: number; y: number };
    },
  ): { success: boolean; board: Piece[] } {
    const success = this.gameService.movePiece(move.from, move.to);
    return {
      success,
      board: this.gameService.getBoard(),
    };
  }
}

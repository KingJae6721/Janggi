import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Move } from './move.entity';
import { Repository } from 'typeorm';

export interface Piece {
  type: '차' | '마' | '상' | '포' | '졸' | '왕' | '사';
  team: 'red' | 'blue';
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
  ) {
    this.initializeBoard();
  }

  // 초기 말 배치
  initializeBoard() {
    this.board = [
      //red
      { type: '차', team: 'red', position: { x: 0, y: 0 } },
      { type: '마', team: 'red', position: { x: 1, y: 0 } },
      { type: '상', team: 'red', position: { x: 2, y: 0 } },
      { type: '사', team: 'red', position: { x: 3, y: 0 } },
      { type: '왕', team: 'red', position: { x: 4, y: 0 } },
      { type: '사', team: 'red', position: { x: 5, y: 0 } },
      { type: '상', team: 'red', position: { x: 2, y: 0 } },
      { type: '마', team: 'red', position: { x: 1, y: 0 } },
      { type: '차', team: 'red', position: { x: 8, y: 0 } },
      { type: '포', team: 'red', position: { x: 1, y: 2 } },
      { type: '포', team: 'red', position: { x: 7, y: 2 } },
      { type: '졸', team: 'red', position: { x: 0, y: 3 } },
      { type: '졸', team: 'red', position: { x: 2, y: 3 } },
      { type: '졸', team: 'red', position: { x: 4, y: 3 } },
      { type: '졸', team: 'red', position: { x: 4, y: 3 } },
      { type: '졸', team: 'red', position: { x: 6, y: 3 } },
      { type: '졸', team: 'red', position: { x: 8, y: 3 } },

      //blue
      { type: '차', team: 'blue', position: { x: 0, y: 9 } },
      { type: '마', team: 'blue', position: { x: 1, y: 9 } },
      { type: '상', team: 'blue', position: { x: 2, y: 9 } },
      { type: '사', team: 'blue', position: { x: 3, y: 9 } },
      { type: '왕', team: 'blue', position: { x: 4, y: 9 } },
      { type: '사', team: 'blue', position: { x: 5, y: 9 } },
      { type: '상', team: 'blue', position: { x: 2, y: 9 } },
      { type: '마', team: 'blue', position: { x: 1, y: 9 } },
      { type: '차', team: 'blue', position: { x: 8, y: 9 } },
      { type: '포', team: 'blue', position: { x: 1, y: 7 } },
      { type: '포', team: 'blue', position: { x: 7, y: 7 } },
      { type: '졸', team: 'blue', position: { x: 0, y: 6 } },
      { type: '졸', team: 'blue', position: { x: 2, y: 6 } },
      { type: '졸', team: 'blue', position: { x: 4, y: 6 } },
      { type: '졸', team: 'blue', position: { x: 4, y: 6 } },
      { type: '졸', team: 'blue', position: { x: 6, y: 6 } },
      { type: '졸', team: 'blue', position: { x: 8, y: 6 } },
    ];
  }

  // 현재 보드 상태 반환
  getBoard(): Piece[] {
    return this.board;
  }

  // 말 이동 처리
  movePiece(
    from: { x: number; y: number },
    to: { x: number; y: number },
  ): boolean {
    const piece = this.board.find(
      (p) => p.position.x === from.x && p.position.y === from.y,
    );

    if (!piece) return false;

    // TODO: 규칙 검증 로직 추가 (말 종류별 이동 가능 여부)
    piece.position = to;
    return true;
  }
}

import { Injectable } from '@nestjs/common';

export interface Piece {
  type: '차' | '마' | '상' | '포' | '졸' | '왕';
  team: 'red' | 'blue';
  position: { x: number; y: number };
}

@Injectable()
export class GameService {
  private board: Piece[] = []; // 현재 게임 상태 저장

  constructor() {
    this.initializeBoard();
  }

  // 초기 말 배치
  initializeBoard() {
    this.board = [
      { type: '차', team: 'red', position: { x: 0, y: 0 } },
      { type: '왕', team: 'red', position: { x: 4, y: 0 } },
      // ... 나머지 말들
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

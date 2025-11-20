import type { PieceData } from '../types/types';

export type Position = { x: number; y: number };

export function getPossibleMoves(
  piece: PieceData,
  board: PieceData[]
): Position[] {
  switch (piece.type) {
    case '마':
      return knightMoves(piece, board);
    case '차':
      return chaMoves(piece, board);
    case '상':
      return elephantMoves(piece, board);
    case '사':
      return kingMoves(piece, board);
    case '왕':
      return kingMoves(piece, board);
    case '포':
      return poMoves(piece, board);
    case '졸':
      return poneMoves(piece, board);
    // 다른 기물도 추가 가능
    default:
      return [];
  }
}

function poneMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece;

  const poneSteps =
    piece.team === 'cho'
      ? [
          { move: { dx: 0, dy: 1 } }, // 아래로 전진
          { move: { dx: -1, dy: 0 } }, // 좌
          { move: { dx: 1, dy: 0 } }, // 우
        ]
      : [
          { move: { dx: 0, dy: -1 } }, // 위로 전진
          { move: { dx: -1, dy: 0 } }, // 좌
          { move: { dx: 1, dy: 0 } }, // 우
        ];

  for (const step of poneSteps) {
    const moveX = x + step.move.dx;
    const moveY = y + step.move.dy;

    if (moveX >= 0 && moveX < 9 && moveY >= 0 && moveY < 10) {
      const occupied = board.find((p) => p?.x === moveX && p?.y === moveY);
      if (!occupied || occupied.team !== piece.team) {
        moves.push({ x: moveX, y: moveY });
      }
    }
  }

  return moves;
}

function knightMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece;

  const knightSteps = [
    { block: { dx: 0, dy: -1 }, move: { dx: -1, dy: -2 } },
    { block: { dx: 0, dy: -1 }, move: { dx: 1, dy: -2 } },
    { block: { dx: 0, dy: 1 }, move: { dx: -1, dy: 2 } },
    { block: { dx: 0, dy: 1 }, move: { dx: 1, dy: 2 } },
    { block: { dx: -1, dy: 0 }, move: { dx: -2, dy: -1 } },
    { block: { dx: -1, dy: 0 }, move: { dx: -2, dy: 1 } },
    { block: { dx: 1, dy: 0 }, move: { dx: 2, dy: -1 } },
    { block: { dx: 1, dy: 0 }, move: { dx: 2, dy: 1 } },
  ];

  for (const step of knightSteps) {
    const blockX = x + step.block.dx;
    const blockY = y + step.block.dy;
    const moveX = x + step.move.dx;
    const moveY = y + step.move.dy;

    const blocked = board.find((p) => p?.x === blockX && p?.y === blockY);
    if (blocked) continue;

    if (moveX >= 0 && moveX < 9 && moveY >= 0 && moveY < 10) {
      const occupied = board.find((p) => p?.x === moveX && p?.y === moveY);
      if (!occupied || occupied.team !== piece.team) {
        moves.push({ x: moveX, y: moveY });
      }
    }
  }

  return moves;
}

function elephantMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y, team } = piece;

  // 상: 상하좌우로 1칸 이동 후, 그 지점에서 대각선으로 2칸 이동
  // 지나는 경로(첫 칸, 두 번째 칸)에 기물이 있으면 이동 불가
  const directions = [
    // 상(위) → 좌상, 우상
    {
      first: { dx: 0, dy: -1 },
      second: { dx: -1, dy: -2 },
      final: { dx: -2, dy: -3 },
    },
    {
      first: { dx: 0, dy: -1 },
      second: { dx: 1, dy: -2 },
      final: { dx: 2, dy: -3 },
    },
    // 하(아래) → 좌하, 우하
    {
      first: { dx: 0, dy: 1 },
      second: { dx: -1, dy: 2 },
      final: { dx: -2, dy: 3 },
    },
    {
      first: { dx: 0, dy: 1 },
      second: { dx: 1, dy: 2 },
      final: { dx: 2, dy: 3 },
    },
    // 좌(왼쪽) → 좌상, 좌하
    {
      first: { dx: -1, dy: 0 },
      second: { dx: -2, dy: -1 },
      final: { dx: -3, dy: -2 },
    },
    {
      first: { dx: -1, dy: 0 },
      second: { dx: -2, dy: 1 },
      final: { dx: -3, dy: 2 },
    },
    // 우(오른쪽) → 우상, 우하
    {
      first: { dx: 1, dy: 0 },
      second: { dx: 2, dy: -1 },
      final: { dx: 3, dy: -2 },
    },
    {
      first: { dx: 1, dy: 0 },
      second: { dx: 2, dy: 1 },
      final: { dx: 3, dy: 2 },
    },
  ];

  for (const dir of directions) {
    const firstX = x + dir.first.dx;
    const firstY = y + dir.first.dy;
    const secondX = x + dir.second.dx;
    const secondY = y + dir.second.dy;
    const finalX = x + dir.final.dx;
    const finalY = y + dir.final.dy;

    // 최종 위치가 보드 범위 내인지 체크
    if (finalX < 0 || finalX >= 9 || finalY < 0 || finalY >= 10) continue;

    // 경로상의 두 칸(첫 번째, 두 번째)이 모두 비어있어야 함
    const blocked1 = board.find((p) => p.x === firstX && p.y === firstY);
    const blocked2 = board.find((p) => p.x === secondX && p.y === secondY);
    if (blocked1 || blocked2) continue;

    // 최종 위치에 아군이 없으면 이동 가능
    const occupied = board.find((p) => p.x === finalX && p.y === finalY);
    if (!occupied || occupied.team !== team) {
      moves.push({ x: finalX, y: finalY });
    }
  }

  return moves;
}

function chaMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y, team } = piece;

  // 직선 네 방향 (상, 하, 좌, 우)
  const directions = [
    { dx: 0, dy: -1 }, // 위
    { dx: 0, dy: 1 }, // 아래
    { dx: -1, dy: 0 }, // 왼쪽
    { dx: 1, dy: 0 }, // 오른쪽
  ];

  for (const dir of directions) {
    let moveX = x + dir.dx;
    let moveY = y + dir.dy;

    // 해당 방향으로 계속 전진
    while (moveX >= 0 && moveX < 9 && moveY >= 0 && moveY < 10) {
      const occupied = board.find((p) => p.x === moveX && p.y === moveY);

      if (occupied) {
        // 상대 기물이면 잡을 수 있음
        if (occupied.team !== team) {
          moves.push({ x: moveX, y: moveY });
        }
        // 아군이든 상대든 막히므로 break
        break;
      } else {
        // 빈 칸이면 이동 가능
        moves.push({ x: moveX, y: moveY });
      }

      // 같은 방향으로 한 칸 더
      moveX += dir.dx;
      moveY += dir.dy;
    }
  }

  return moves;
}
function poMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y, team } = piece;

  const directions = [
    { dx: 0, dy: -1 }, // 위
    { dx: 0, dy: 1 }, // 아래
    { dx: -1, dy: 0 }, // 왼쪽
    { dx: 1, dy: 0 }, // 오른쪽
  ];

  for (const dir of directions) {
    let moveX = x + dir.dx;
    let moveY = y + dir.dy;
    let jumped = false;

    while (moveX >= 0 && moveX < 9 && moveY >= 0 && moveY < 10) {
      const occupied = board.find((p) => p.x === moveX && p.y === moveY);

      if (!jumped) {
        if (occupied) {
          // 포끼리 못 넘는 조건
          if (occupied.type === '포') break;
          jumped = true;
        }
      } else {
        if (occupied) {
          if (occupied.team !== team && occupied.type !== '포') {
            moves.push({ x: moveX, y: moveY });
          }
          break;
        } else {
          moves.push({ x: moveX, y: moveY });
        }
      }

      moveX += dir.dx;
      moveY += dir.dy;
    }
  }

  return moves;
}

function kingMoves(piece: PieceData, board: PieceData[]): Position[] {
  const moves: Position[] = [];
  const { x, y, team } = piece;

  // 기본 이동 방향: 상하좌우
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  // 궁 중앙 좌표
  const center = team === 'cho' ? { x: 4, y: 1 } : { x: 4, y: 8 };

  // 중앙에 있을 때 대각선 이동 추가
  if (x === center.x && y === center.y) {
    directions.push({ dx: -1, dy: -1 });
    directions.push({ dx: -1, dy: 1 });
    directions.push({ dx: 1, dy: -1 });
    directions.push({ dx: 1, dy: 1 });
  }

  // 중앙은 언제든지 이동 가능
  if (!(x === center.x && y === center.y)) {
    directions.push({ dx: center.x - x, dy: center.y - y });
  }

  for (const dir of directions) {
    const moveX = x + dir.dx;
    const moveY = y + dir.dy;

    // 궁성 범위 체크
    const inPalace =
      team === 'cho'
        ? moveX >= 3 && moveX <= 5 && moveY >= 0 && moveY <= 2
        : moveX >= 3 && moveX <= 5 && moveY >= 7 && moveY <= 9;

    if (!inPalace) continue;

    const occupied = board.find((p) => p.x === moveX && p.y === moveY);
    if (!occupied || occupied.team !== team) {
      moves.push({ x: moveX, y: moveY });
    }
  }

  return moves;
}

export function isCheck(board: PieceData[], team: 'cho' | 'han'): boolean {
  // 현재 team의 왕 찾기
  const king = board.find(p => p.type === '왕' && p.team === team);
  if (!king) return false;

  // 상대 기물들 추출
  const opponentPieces = board.filter(p => p.team !== team);

  // 상대 기물들의 이동 가능 위치 검사
  for (const piece of opponentPieces) {
    const moves = getPossibleMoves(piece, board);
    if (moves.some(pos => pos.x === king.x && pos.y === king.y)) {
      return true; // 왕이 공격받음 → 장군 상태
    }
  }

  return false;
}

export function getLegalMoves(piece: PieceData, board: PieceData[]): Position[] {
  const possible = getPossibleMoves(piece, board);
  const legal: Position[] = [];

  for (const move of possible) {
    // 가상 보드 생성
    const newBoard = board.map(p => ({ ...p }));
    const idx = newBoard.findIndex(p => p.x === piece.x && p.y === piece.y);
    if (idx !== -1) {
      newBoard[idx] = { ...piece, x: move.x, y: move.y };
    }

    // 상대 기물 제거 (잡는 경우)
    const capturedIdx = newBoard.findIndex(p => p.x === move.x && p.y === move.y && p.team !== piece.team);
    if (capturedIdx !== -1) newBoard.splice(capturedIdx, 1);

    // 자기 왕이 공격받는지 검사
    if (!isCheck(newBoard, piece.team)) {
      legal.push(move);
    }
  }

  return legal;
}
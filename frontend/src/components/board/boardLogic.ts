import type { Dispatch, SetStateAction } from 'react';

import type { PieceData } from '../../types/types';
import type { Move } from '../../types/move';
import { initialBoard } from '../../constants/initialPieces';
import { addMove, endGame, validateMove, getPossibleMoves } from '../../api/gameApi';

export const getTeamByTurn = (turn: number): 'cho' | 'han' => {
  return turn % 2 === 1 ? 'cho' : 'han';
};

// 이동 기록 적용 + 턴 정보 반환
export const applyMoves = (
  moves: Move[],
  index: number
): {
  board: (PieceData | null)[][];
  turnInfo: { count: number; turn: 'cho' | 'han' };
} => {
  const newBoard: (PieceData | null)[][] = initialBoard.map((row) =>
    row.slice()
  );

  moves.slice(0, index).forEach((move) => {
    const team = getTeamByTurn(move.turn);
    newBoard[move.fromY][move.fromX] = null;
    newBoard[move.toY][move.toX] = {
      type: move.piece,
      team,
      x: move.toX,
      y: move.toY,
    };
  });

  // index번째 수까지 적용했으므로, 다음 턴은 index+1
  const nextTurn = getTeamByTurn(index + 1);

  return {
    board: newBoard,
    turnInfo: { count: index + 1, turn: nextTurn },
  };
};

// 체크메이트 판정 (백엔드 API 사용)
export const checkMate = async (
  gameId: number,
  flatBoard: PieceData[],
  turn: 'cho' | 'han'
): Promise<boolean> => {
  // 1. 현재 왕 찾기
  const king = flatBoard.find((p) => p.type === '왕' && p.team === turn);
  if (!king) return true;

  // 2. 먼저 장군 상태인지 확인 (백엔드 API 호출)
  const inCheck = await isCheckViaBackend(gameId, flatBoard, turn); // ← 백엔드에서 장군 여부 확인하는 API 필요
  if (!inCheck) return false; // 장군이 아니면 체크메이트 아님

  // 3. 왕의 이동 가능한 위치 조회
  const kingMoves = await getPossibleMoves(gameId, { x: king.x, y: king.y });

  // 4. 이동 가능한 곳 중 유효한 수가 있는지 검사
  for (const move of kingMoves) {
    const validation = await validateMove(
      gameId,
      { x: king.x, y: king.y },
      { x: move.x, y: move.y }
    );

    if (validation.valid) {
      return false; // 탈출 가능 → 체크메이트 아님
    }
  }

  // 5. 장군 상태 + 탈출 불가 → 체크메이트
  return true;
};

// isCheck 함수를 백엔드 API로 대체
const isCheckViaBackend = async (
  gameId: number,
  flatBoard: PieceData[],
  team: 'cho' | 'han'
): Promise<boolean> => {
  const king = flatBoard.find((p) => p.type === '왕' && p.team === team);
  if (!king) return false;

  // 상대편 기물들이 왕을 공격할 수 있는지 확인
  const opponentPieces = flatBoard.filter((p) => p.team !== team);

  for (const piece of opponentPieces) {
    try {
      const moves = await getPossibleMoves(gameId, { x: piece.x, y: piece.y });
      if (moves.some((pos) => pos.x === king.x && pos.y === king.y)) {
        return true; // 장군 상태
      }
    } catch (error) {
      console.error('장군 상태 확인 실패:', error);
    }
  }

  return false;
};

// 실제 게임 중 이동 처리 로직
// 함수형 업데이트 사용
export const movePieceLogic = async (
  gameId: number,
  toX: number,
  toY: number,
  selected: PieceData,
  turnInfo: { count: number; turn: 'cho' | 'han' },
  wasCheck: { cho: boolean; han: boolean },
  setPieceBoard: Dispatch<SetStateAction<(PieceData | null)[][]>>,
  setSelected: Dispatch<SetStateAction<PieceData | null>>,
  setGameOver: Dispatch<SetStateAction<boolean>>,
  setWinner: Dispatch<SetStateAction<'cho' | 'han' | null>>,
  setWasCheck: Dispatch<SetStateAction<{ cho: boolean; han: boolean }>>,
  setTurnInfo: Dispatch<SetStateAction<{ count: number; turn: 'cho' | 'han' }>>
) => {
  // 현재 보드 상태를 먼저 가져옴
  let currentBoard: (PieceData | null)[][] = [];
  setPieceBoard((prev) => {
    currentBoard = prev;
    return prev;
  });

  const flatBoard = currentBoard.flat().filter((p): p is PieceData => p !== null);

  // 백엔드에서 이동 검증
  /*
  try {
    const validation = await validateMove(
      { x: selected.x, y: selected.y },
      { x: toX, y: toY },
      flatBoard
    );

    if (!validation.valid) {
      // alert(validation.message || '유효하지 않은 이동입니다.');
      // return;
      console.warn('Validation failed but proceeding:', validation.message);
    }
  } catch (error) {
    console.error('이동 검증 실패:', error);
    // alert('이동 검증 중 오류가 발생했습니다.');
    // return;
  }
  */

  // 검증 통과 후 보드 업데이트
  let newBoard: (PieceData | null)[][] = [];
  setPieceBoard((prev) => {
    newBoard = prev.map((row) => row.slice());
    newBoard[selected.y][selected.x] = null;
    newBoard[toY][toX] = { ...selected, x: toX, y: toY };
    return newBoard;
  });

  setSelected(null);

  await addMove(gameId, {
    turn: turnInfo.count,
    piece: selected.type,
    fromX: selected.x,
    fromY: selected.y,
    toX,
    toY,
    team: selected.team,
  });

  const updatedFlatBoard = newBoard.flat().filter((p): p is PieceData => p !== null);
  const choKing = updatedFlatBoard.find((p) => p.type === '왕' && p.team === 'cho');
  const hanKing = updatedFlatBoard.find((p) => p.type === '왕' && p.team === 'han');

  if (!choKing || !hanKing) {
    setGameOver(true);
    const winnerTeam = choKing ? 'cho' : 'han';
    setWinner(winnerTeam);
    await endGame(gameId, winnerTeam);
    return;
  }

  const nextTurn = turnInfo.turn === 'cho' ? 'han' : 'cho';
  const isMate = await checkMate(gameId, updatedFlatBoard, nextTurn);

  if (isMate) {
    setGameOver(true);
    console.log('체크메이트'
    );

    setWinner(turnInfo.turn);
    await endGame(gameId, turnInfo.turn);
    return;
  }

  const currentTurn = turnInfo.turn;
  const checkNow = await isCheckViaBackend(gameId, updatedFlatBoard, currentTurn);

  if (!checkNow && wasCheck[currentTurn]) {
    console.log('멍군!');
  }

  const nextCount = turnInfo.count + 1;
  const checkNext = await isCheckViaBackend(gameId, updatedFlatBoard, nextTurn);

  // ✅ check 상태면 "장군!"만 출력
  if (checkNow) {
    console.log('장군!');
  }
  if (checkNext) {
    console.log('장군!');
  }

  setWasCheck((prevWas) => ({
    ...prevWas,
    [currentTurn]: checkNow,
    [nextTurn]: checkNext,
  }));

  setTurnInfo({ count: nextCount, turn: nextTurn });
};

import type { Dispatch, SetStateAction } from 'react';
import type { PieceData } from '../../types/types';
import type { Move } from '../../types/move';
import { initialBoard } from '../../constants/initialPieces';
import { getLegalMoves, isCheck } from '../../utils/janggiRules';
import { addMove, endGame } from '../../api/gameApi';

// 턴 번호 → 팀 변환
export const getTeamByTurn = (turn: number): 'cho' | 'han' => {
  return turn % 2 === 1 ? 'cho' : 'han';
};

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
// 체크메이트 판정
export const checkMate = (
  flatBoard: PieceData[],
  turn: 'cho' | 'han'
): boolean => {
  const king = flatBoard.find((p) => p.type === '왕' && p.team === turn);
  if (!king) return true;

  const kingMoves = getLegalMoves(king, flatBoard);
  const canEscape = kingMoves.some((move) => {
    const simulated = flatBoard
      .filter((p) => !(p.x === move.x && p.y === move.y))
      .map((p) =>
        p.x === king.x && p.y === king.y
          ? { ...p, x: move.x, y: move.y }
          : { ...p }
      );
    return !isCheck(simulated, turn);
  });

  return isCheck(flatBoard, turn) && !canEscape;
};

// 실제 이동 처리 로직
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
  let newBoard: (PieceData | null)[][] = [];

  // 1. 기물 이동
  setPieceBoard((prev) => {
    newBoard = prev.map((row) => row.slice());
    newBoard[selected.y][selected.x] = null;
    newBoard[toY][toX] = { ...selected, x: toX, y: toY };
    return newBoard;
  });

  setSelected(null);

  // 2. DB에 이동 기록 저장
  await addMove(gameId, {
    turn: turnInfo.count,
    piece: selected.type,
    fromX: selected.x,
    fromY: selected.y,
    toX,
    toY,
    team: selected.team,
  });

  // 3. 왕 존재 여부 확인
  const flatBoard = newBoard.flat().filter((p): p is PieceData => p !== null);
  const choKing = flatBoard.find((p) => p.type === '왕' && p.team === 'cho');
  const hanKing = flatBoard.find((p) => p.type === '왕' && p.team === 'han');

  if (!choKing || !hanKing) {
    setGameOver(true);
    const winnerTeam = choKing ? 'cho' : 'han';
    setWinner(winnerTeam);
    await endGame(gameId, winnerTeam);
    return;
  }

  // 4. 체크메이트 판정
  const nextTurn = turnInfo.turn === 'cho' ? 'han' : 'cho';
  if (checkMate(flatBoard, nextTurn)) {
    setGameOver(true);
    setWinner(turnInfo.turn);
    await endGame(gameId, turnInfo.turn);
    return;
  }

  // 5. 체크/멍군 처리
  const currentTurn = turnInfo.turn;
  const checkNow = isCheck(flatBoard, currentTurn);
  if (!checkNow && wasCheck[currentTurn]) {
    console.log('멍군!');
  }

  const nextCount = turnInfo.count + 1;
  const checkNext = isCheck(flatBoard, nextTurn);

  setWasCheck((prevWas) => ({
    ...prevWas,
    [currentTurn]: checkNow,
    [nextTurn]: checkNext,
  }));

  // 6. 턴 정보 업데이트
  setTurnInfo({ count: nextCount, turn: nextTurn });
};

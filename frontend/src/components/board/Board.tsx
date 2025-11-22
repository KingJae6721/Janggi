import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import './Board.css';
import { useState, useEffect, useRef } from 'react';
import type { PieceData } from '../../types/types';
import { initialBoard } from '../../constants/initialPieces';
import { getLegalMoves, isCheck } from '../../utils/janggiRules';
import { addMove, getBoard, endGame } from '../../api/gameApi'; // 상단에 추가

type BoardProps = {
  gameId: number;
};

export const Board = ({ gameId }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // 보드 상태: 2차원 배열로 각 칸에 기물(PieceData) 또는 null 저장
  const [pieceBoard, setPieceBoard] =
    useState<(PieceData | null)[][]>(initialBoard);

  // 현재 선택된 기물
  const [selected, setSelected] = useState<PieceData | null>(null);

  // 턴 정보: 몇 번째 턴인지와 현재 턴의 진영(초/한)
  const [turnInfo, setTurnInfo] = useState<{
    count: number;
    turn: 'cho' | 'han';
  }>({
    count: 1,
    turn: 'cho',
  });

  //전 턴에 내왕이 장군상태인지 체크
  const [wasCheck, setWasCheck] = useState<{ cho: boolean; han: boolean }>({
    cho: false,
    han: false,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'cho' | 'han' | null>(null);

  // Board가 마운트될 때 스크롤 이동
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  // 현재 보드에서 기물만 추출(flat으로 1차원 배열로 변환)
  const pieces = pieceBoard.flat().filter((p): p is PieceData => p !== null);

  // 선택된 기물의 합법적인 이동 후보 계산
  const possibleMoves = selected ? getLegalMoves(selected, pieces) : [];

  // 기물 선택 핸들러
  const handleSelect = (piece: PieceData) => {
    // 이미 선택된 기물을 다시 클릭하면 선택 해제
    if (selected?.x === piece.x && selected?.y === piece.y) {
      setSelected(null);
    } else {
      // 새로운 기물 선택
      setSelected(piece);
    }
  };
const movePiece = async (toX: number, toY: number) => {
  if (!selected || gameOver) return;

  let newBoard: (PieceData | null)[][] = [];

  // 1. 보드 상태 업데이트
  setPieceBoard((prev) => {
    newBoard = prev.map((row) => row.slice()); // 깊은 복사
    newBoard[selected.y][selected.x] = null;   // 원래 위치 비우기
    newBoard[toY][toX] = { ...selected, x: toX, y: toY }; // 새 위치에 기물 배치
    return newBoard;
  });

  // 선택 해제
  setSelected(null);

  // 2. 이동 기록 저장
  await addMove(gameId, {
    turn: turnInfo.count,
    piece: selected.type,
    fromX: selected.x,
    fromY: selected.y,
    toX,
    toY,
    team: selected.team,
  });

  // 3. 왕 존재 여부 확인 (게임 종료 조건)
  const flatBoard = newBoard.flat().filter((p): p is PieceData => p !== null);
  const choKing = flatBoard.find((p) => p.type === '왕' && p.team === 'cho');
  const hanKing = flatBoard.find((p) => p.type === '왕' && p.team === 'han');

  if (!choKing) {
    setGameOver(true);
    setWinner('han');
    await endGame(gameId, 'han');
    return;
  }
  if (!hanKing) {
    setGameOver(true);
    setWinner('cho');
    await endGame(gameId, 'cho');
    return;
  }

  // 4. 체크메이트 판정
  const nextTurn = turnInfo.turn === 'cho' ? 'han' : 'cho';
  const king = flatBoard.find((p) => p.type === '왕' && p.team === nextTurn);
  const kingMoves = king ? getLegalMoves(king, flatBoard) : [];

  const canEscape = kingMoves.some((move) => {
    const simulated = flatBoard
      .filter((p) => !(p.x === move.x && p.y === move.y)) // 이동 위치에 있던 상대 기물 제거
      .map((p) =>
        p.x === king?.x && p.y === king?.y
          ? { ...p, x: move.x, y: move.y }
          : { ...p }
      );
    return !isCheck(simulated, nextTurn);
  });

  const isCheckmate = isCheck(flatBoard, nextTurn) && !canEscape;
  if (isCheckmate) {
    console.log('체크메이트!!');
    setGameOver(true);
    setWinner(turnInfo.turn); // 현재 턴 플레이어 승리
    await endGame(gameId, turnInfo.turn);
    return;
  }

  // 5. 멍군 판정 (내 턴에서 장군 해소 여부 확인)
  const currentTurn = turnInfo.turn;
  const checkNow = isCheck(flatBoard, currentTurn);
  if (!checkNow && wasCheck[currentTurn]) {
    console.log('멍군!');
  }

  // 6. 턴 교체
  const nextCount = turnInfo.count + 1;
  const checkNext = isCheck(flatBoard, nextTurn);

  if (checkNext) {
    console.log(`${nextTurn} 왕이 장군 상태입니다!`);
  }

  setWasCheck((prevWas) => ({
    ...prevWas,
    [currentTurn]: checkNow,
    [nextTurn]: checkNext,
  }));

  setTurnInfo({ count: nextCount, turn: nextTurn });
};
  return (
    <div className='board' ref={boardRef}>
      {/* 9x8 셀 그리드 (보드 바탕) */}
      <div className='board-grid'>
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <BoardCell
                key={`${rowIndex}-${colIndex}`}
                x={colIndex}
                y={rowIndex}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 기물 렌더링 레이어 */}
      <div className='pieces-layer'>
        {pieces.map((piece, i) => {
          const isSelected = selected?.x === piece.x && selected?.y === piece.y;
          const isOpponent = piece.team !== turnInfo.turn; // 현재 턴과 다른 진영

          return (
            <div
              key={`piece-${i}`}
              className={`piece-position ${isSelected ? 'selected' : ''} ${
                isOpponent ? 'unable' : ''
              }`}
              style={{
                left: `${piece.x * 60}px`,
                top: `${piece.y * 60}px`,
              }}
              onClick={() => {
                if (!isOpponent) handleSelect(piece); // 상대 진영이면 클릭 막기
              }}
            >
              <Piece type={piece.type} team={piece.team} size={50} />
            </div>
          );
        })}
      </div>

      {/* 이동 가능 위치 하이라이트 */}
      {selected &&
        possibleMoves.map((pos, i) => (
          <div
            key={`highlight-${i}`}
            className='highlight-circle'
            style={{
              left: `${pos.x * 60}px`,
              top: `${pos.y * 60}px`,
            }}
            onClick={() => movePiece(pos.x, pos.y)}
          />
        ))}
      {/*게임오버*/}
      {gameOver && (
        <div>
          {winner
            ? `${winner === 'cho' ? '초' : '한'} 진영 승리!`
            : '무승부입니다'}
        </div>
      )}
    </div>
  );
};
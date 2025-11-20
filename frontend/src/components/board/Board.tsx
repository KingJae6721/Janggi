import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import './Board.css';
import { useState } from 'react';
import type { PieceData } from '../../types/types';
import { initialBoard } from '../../constants/initialPieces';
import { getPossibleMoves } from '../../utils/janggiRules';

export const Board = () => {
  const [pieceBoard, setPieceBoard] =
    useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);
  const [turnInfo, setTurnInfo] = useState<{
    count: number;
    turn: 'cho' | 'han';
  }>({
    count: 1,
    turn: 'cho',
  });

  // 기물만 추출
  const pieces = pieceBoard.flat().filter((p): p is PieceData => p !== null);
  const possibleMoves = selected ? getPossibleMoves(selected, pieces) : [];

  const handleSelect = (piece: PieceData) => {
    if (selected?.x === piece.x && selected?.y === piece.y) {
      setSelected(null);
    } else {
      setSelected(piece);
    }
  };

  const movePiece = (toX: number, toY: number) => {
    if (!selected) return;

    setPieceBoard((prev) => {
      const newBoard = prev.map((row) => row.slice());
      newBoard[selected.y][selected.x] = null;
      newBoard[toY][toX] = { ...selected, x: toX, y: toY };
      return newBoard;
    });

    setSelected(null);

    // 턴 교체
    setTurnInfo((prev) => ({
      count: prev.count + 1,
      turn: prev.turn === 'cho' ? 'han' : 'cho',
    }));
  };

  return (
    <div className='board'>
      {/* 9x8 셀 그리드 */}
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

      {/* 기물 렌더링 */}
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
    </div>
  );
};

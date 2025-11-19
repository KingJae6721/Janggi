import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import './Board.css';
import { useState } from 'react';
import type { PieceData } from '../../types/types';
import { initialBoard } from '../../constants/initialPieces';

export const Board = () => {
  // initialBoard는 (PieceData | null)[][] 구조
  const [pieceBoard, setPieceBoard] = useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);

  const handleSelect = (piece: PieceData) => {
    setSelected(piece);
  };

  return (
    <div className="board">
      {/* 9x8 셀 그리드 */}
      <div className="board-grid">
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={rowIndex} className="board-row">
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

      {/* 10x9 교차점에 기물 배치 */}
      <div className="pieces-layer">
        {pieceBoard.map((row, rowIndex) =>
          row.map(
            (cell, colIndex) =>
              cell && (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="piece-position"
                  style={{
                    left: `${colIndex * 60}px`,
                    top: `${rowIndex * 60}px`,
                  }}
                  onClick={() => handleSelect(cell)}
                >
                  <Piece type={cell.type} team={cell.team} size={50} />
                </div>
              )
          )
        )}
      </div>

      {/* 선택된 기물 기준 원 표시 */}
      {selected && (
        <>
          <div
            className="highlight-circle"
            style={{
              left: `${selected.x * 60}px`,
              top: `${(selected.y - 1) * 60}px`,
            }}
          />
          <div
            className="highlight-circle"
            style={{
              left: `${selected.x * 60}px`,
              top: `${(selected.y + 1) * 60}px`,
            }}
          />
          <div
            className="highlight-circle"
            style={{
              left: `${(selected.x - 1) * 60}px`,
              top: `${selected.y * 60}px`,
            }}
          />
          <div
            className="highlight-circle"
            style={{
              left: `${(selected.x + 1) * 60}px`,
              top: `${selected.y * 60}px`,
            }}
          />
        </>
      )}
    </div>
  );
};
import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import './Board.css';
import { useState } from 'react';
import type { PieceData } from '../../types/types';
import { initialPieces } from '../../constants/initialPieces';

export const Board = () => {
  const [pieces] = useState<PieceData[]>(initialPieces);

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

      {/* 10x9 교차점에 기물 배치 */}
      <div className='pieces-layer'>
        {pieces.map((piece, index) => (
          <div
            key={index}
            className='piece-position'
            style={{
              left: `${piece.x * 60}px`, // 60px = 셀 크기
              top: `${piece.y * 60}px`,
            }}
          >
            <Piece type={piece.type} team={piece.team} size={50} />
          </div>
        ))}
      </div>
    </div>
  );
};

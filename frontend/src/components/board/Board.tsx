import { BoardCell } from './BoardCell';
import './Board.css';
import { useState } from 'react';
import type { PieceData } from '../../types/types';

// 초기 기물 배치
const initialPieces: PieceData[] = [
  // 초 진영 (위쪽)
  { type: '차', team: 'cho', x: 0, y: 0 },
  { type: '차', team: 'cho', x: 8, y: 0 },
  { type: '포', team: 'cho', x: 1, y: 2 },
  { type: '포', team: 'cho', x: 7, y: 2 },

  // 한 진영 (아래쪽)
  { type: '차', team: 'han', x: 0, y: 9 },
  { type: '차', team: 'han', x: 8, y: 9 },
  { type: '포', team: 'han', x: 1, y: 7 },
  { type: '포', team: 'han', x: 7, y: 7 },
];

export const Board = () => {
  const [pieces] = useState<PieceData[]>(initialPieces);

  const getPieceAt = (x: number, y: number) => {
    return pieces.find((p) => p.x === x && p.y === y);
  };

  return (
    <div className='board'>
      {Array.from({ length: 11 }).map((_, rowIndex) => (
        <div key={rowIndex} className='board-row'>
          {Array.from({ length: 10 }).map((_, colIndex) => (
            <BoardCell
              key={`${rowIndex}-${colIndex}`}
              x={colIndex}
              y={rowIndex}
              piece={getPieceAt(colIndex, rowIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

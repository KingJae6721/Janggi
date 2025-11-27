import { BoardCell } from './BoardCell';

export const BoardGrid = () => {
  return (
    <div className='board-grid'>
      {Array.from({ length: 9 }).map((_, rowIndex) => (
        <div key={rowIndex} className='board-row'>
          {Array.from({ length: 8 }).map((_, colIndex) => (
            <BoardCell key={`${rowIndex}-${colIndex}`} x={colIndex} y={rowIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

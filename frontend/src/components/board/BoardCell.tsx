import type { PieceData } from '../../types/types';
import './BoardCell.css';

type BoardCellProps = {
  x: number;
  y: number;
  piece?: PieceData;
};

export const BoardCell = ({ x, y }: BoardCellProps) => {
  return (
    <div className='board-cell' data-x={x} data-y={y}>
      {/* 나중에 기물이 여기 들어갈 예정 */}
    </div>
  );
};

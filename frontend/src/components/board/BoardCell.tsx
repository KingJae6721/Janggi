import './BoardCell.css';

type BoardCellProps = {
  x: number;
  y: number;
};

export const BoardCell = ({ x, y }: BoardCellProps) => {
  return <div className='board-cell' data-x={x} data-y={y}></div>;
};

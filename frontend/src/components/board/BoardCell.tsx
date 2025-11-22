import './BoardCell.css';

type BoardCellProps = {
  x: number;
  y: number;
};

export const BoardCell = ({ x, y }: BoardCellProps) => {
  const diagonalForward = [
    { x: 3, y: 0 },
    { x: 4, y: 1 },
    { x: 3, y: 7 },
    { x: 4, y: 8 },
  ];
  const diagonalBackward = [
    { x: 4, y: 0 },
    { x: 3, y: 1 },
    { x: 3, y: 8 },
    { x: 4, y: 7 },
  ];

  // 현재 셀이 대각선이 필요한지 확인
  const hasFWDiagonal = diagonalForward.some(
    (cell) => cell.x === x && cell.y === y
  );
  const hasBWDiagonal = diagonalBackward.some(
    (cell) => cell.x === x && cell.y === y
  );

  return (
    <div
      className={`board-cell ${
        hasFWDiagonal
          ? ' diagonal fwdiagonal'
          : hasBWDiagonal
          ? ' diagonal bwdiagonal'
          : ''
      }`}
      data-x={x}
      data-y={y}
    ></div>
  );
};
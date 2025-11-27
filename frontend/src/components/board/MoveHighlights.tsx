import { useGameContext } from '../../contexts/GameContext';

type MoveHighlightsProps = {
  selected: any;
  possibleMoves: { x: number; y: number }[];
  onMoveClick: (x: number, y: number) => void;
};

export const MoveHighlights = ({
  selected,
  possibleMoves,
  onMoveClick,
}: MoveHighlightsProps) => {
  const { isReplay } = useGameContext();

  if (!selected || isReplay) return null;

  return (
    <>
      {possibleMoves.map((pos, i) => (
        <div
          key={`highlight-${i}`}
          className='highlight-circle'
          style={{ left: `${pos.x * 60}px`, top: `${pos.y * 60}px` }}
          onClick={() => onMoveClick(pos.x, pos.y)}
        />
      ))}
    </>
  );
};

import { Button } from '../common/Button';

type ReplayControlsProps = {
  onFetchMoves: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
};

export const ReplayControls = ({
  onFetchMoves,
  onPrev,
  onNext,
  onExit,
}: ReplayControlsProps) => {
  return (
    <div>
      <Button onClick={onFetchMoves}>히스토리 불러오기</Button>
      <Button onClick={onPrev}>◀ 이전</Button>
      <Button onClick={onNext}>다음 ▶</Button>
      <Button onClick={onExit}>복기 종료</Button>
    </div>
  );
};

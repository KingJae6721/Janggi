import './Board.css';
import { useGameContext } from '../../contexts/GameContext';
import { useBoardState } from './hooks/useBoardState';
import { useReplayState } from './hooks/useReplayState';
import { usePieceMovement } from './hooks/usePieceMovement';
import { BoardGrid } from './BoardGrid';
import { PiecesLayer } from './PiecesLayer';
import { MoveHighlights } from './MoveHighlights';
import { ReplayControls } from './ReplayControls';

export const Board = () => {
  const { isReplay } = useGameContext();

  // 커스텀 훅으로 상태 관리
  const boardState = useBoardState();
  const {
    boardRef,
    isReady,
    pieceBoard,
    setPieceBoard,
    selected,
    setSelected,
    wasCheck,
    setWasCheck,
    possibleMoves,
    setPossibleMoves,
    setIsLoadingMoves,
    pieces,
  } = boardState;

  // 복기 관련 훅
  const replayState = useReplayState({ setPieceBoard });
  const { fetchMoves, handlePrev, handleNext, exitReplay } = replayState;

  // 기물 이동 관련 훅
  const movement = usePieceMovement({
    selected,
    setSelected,
    pieces,
    setPossibleMoves,
    setIsLoadingMoves,
    wasCheck,
    setPieceBoard,
    setWasCheck,
  });
  const { handleSelect, movePiece } = movement;

  return (
    <div className='board-container'>
      {isReplay && (
        <ReplayControls
          onFetchMoves={fetchMoves}
          onPrev={handlePrev}
          onNext={handleNext}
          onExit={exitReplay}
        />
      )}

      <div
        className='board'
        ref={boardRef}
        style={{ visibility: isReady ? 'visible' : 'hidden' }}
      >
        <BoardGrid />
        <PiecesLayer pieceBoard={pieceBoard} onPieceClick={handleSelect} />
        <MoveHighlights
          selected={selected}
          possibleMoves={possibleMoves}
          onMoveClick={movePiece}
        />
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { getMoves } from '../../../api/gameApi';
import { applyMoves } from '../boardLogic';
import { initialBoard } from '../../../constants/initialPieces';
import type { Move } from '../../../types/move';

type UseReplayStateProps = {
  setPieceBoard: (board: any) => void;
};

export const useReplayState = ({ setPieceBoard }: UseReplayStateProps) => {
  const { gameId, setTurnInfo, setIsReplay } = useGameContext();
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoves = async () => {
    const data = await getMoves(gameId!);
    setMoves(data);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
  };

  const exitReplay = () => {
    setMoves([]);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
    setTurnInfo({ count: 1, turn: 'cho' });
    setIsReplay(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const { board, turnInfo: newTurnInfo } = applyMoves(moves, newIndex);
      setPieceBoard(board);
      setTurnInfo(newTurnInfo);
    }
  };

  const handleNext = () => {
    if (currentIndex < moves.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const { board, turnInfo: newTurnInfo } = applyMoves(moves, newIndex);
      setPieceBoard(board);
      setTurnInfo(newTurnInfo);
    }
  };

  return {
    moves,
    currentIndex,
    fetchMoves,
    exitReplay,
    handlePrev,
    handleNext,
  };
};

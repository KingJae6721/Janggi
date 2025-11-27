import { useGameContext } from '../../../contexts/GameContext';
import { getPossibleMoves } from '../../../api/gameApi';
import { movePieceLogic } from '../boardLogic';
import type { PieceData } from '../../../types/types';
import type { Dispatch, SetStateAction } from 'react';

type UsePieceMovementProps = {
  selected: PieceData | null;
  setSelected: Dispatch<SetStateAction<PieceData | null>>;
  pieces: PieceData[];
  setPossibleMoves: Dispatch<SetStateAction<{ x: number; y: number }[]>>;
  setIsLoadingMoves: Dispatch<SetStateAction<boolean>>;
  wasCheck: { cho: boolean; han: boolean };
  setPieceBoard: Dispatch<SetStateAction<(PieceData | null)[][]>>;
  setWasCheck: Dispatch<SetStateAction<{ cho: boolean; han: boolean }>>;
};

export const usePieceMovement = ({
  selected,
  setSelected,
  pieces,
  setPossibleMoves,
  setIsLoadingMoves,
  wasCheck,
  setPieceBoard,
  setWasCheck,
}: UsePieceMovementProps) => {
  const { gameId, turnInfo, setTurnInfo, isReplay, setWinner, setGameOver } =
    useGameContext();

  const handleSelect = async (piece: PieceData) => {
    if (isReplay) return;
    if (selected?.x === piece.x && selected?.y === piece.y) {
      setSelected(null);
      setPossibleMoves([]);
    } else {
      setSelected(piece);
      setIsLoadingMoves(true);
      try {
        if (!gameId) {
          console.error('게임 ID가 없습니다');
          setPossibleMoves([]);
          return;
        }

        const moves = await getPossibleMoves(gameId, { x: piece.x, y: piece.y });
        console.log(piece, gameId)
        console.log(moves)
        setPossibleMoves(moves);
      } catch (error) {
        console.error('이동 가능한 위치를 가져오는데 실패했습니다:', error);
        setPossibleMoves([]);
      } finally {
        setIsLoadingMoves(false);
      }
    }
  };

  const movePiece = (toX: number, toY: number) => {
    if (isReplay || !selected || !gameId) return;
    movePieceLogic(
      gameId,
      toX,
      toY,
      selected,
      turnInfo,
      wasCheck,
      setPieceBoard,
      setSelected,
      setGameOver,
      setWinner,
      setWasCheck,
      (newTurnInfo) => setTurnInfo(newTurnInfo)
    );
  };

  return {
    handleSelect,
    movePiece,
  };
};

import { useState, useEffect, useRef } from 'react';
import { initialBoard } from '../../../constants/initialPieces';
import type { PieceData } from '../../../types/types';

export const useBoardState = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [pieceBoard, setPieceBoard] = useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);
  const [wasCheck, setWasCheck] = useState<{ cho: boolean; han: boolean }>({
    cho: false,
    han: false,
  });
  const [possibleMoves, setPossibleMoves] = useState<{ x: number; y: number }[]>([]);
  const [isLoadingMoves, setIsLoadingMoves] = useState(false);

  useEffect(() => {
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        setIsReady(true);
      });
    } else {
      setTimeout(() => setIsReady(true), 0);
    }
  }, []);

  const pieces = pieceBoard.flat().filter((p): p is PieceData => p !== null);

  return {
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
    isLoadingMoves,
    setIsLoadingMoves,
    pieces,
  };
};

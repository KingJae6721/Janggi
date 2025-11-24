import { useState, useEffect, useRef } from 'react';
import './Board.css';

import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import { Button } from '../common/Button';

import type { Move } from '../../types/move';
import type { PieceData } from '../../types/types';
import { initialBoard } from '../../constants/initialPieces';
import { getLegalMoves } from '../../utils/janggiRules';
import { getMoves } from '../../api/gameApi';

import { applyMoves, movePieceLogic } from './boardLogic';

import type { Dispatch, SetStateAction } from 'react';

type BoardProps = {
  gameId: number;
  turnInfo: { count: number; turn: 'cho' | 'han' };
  setTurnInfo: Dispatch<SetStateAction<{ count: number; turn: 'cho' | 'han' }>>;
  isReplay: boolean;
  onExitReplay?: () => void;
  setWinner: Dispatch<SetStateAction<'cho' | 'han' | null>>; // App에서 내려주는 setter
  setGameOver: Dispatch<SetStateAction<boolean>>; // App에서 내려주는 setter
};

export const Board = ({
  gameId,
  turnInfo,
  setTurnInfo,
  isReplay,
  onExitReplay,
  setWinner,
  setGameOver,
}: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  // 폰트 및 CSS 로딩 상태
  const [isReady, setIsReady] = useState(false);

  // 상태 관리
  const [pieceBoard, setPieceBoard] =
    useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);
  const [wasCheck, setWasCheck] = useState<{ cho: boolean; han: boolean }>({
    cho: false,
    han: false,
  });

  // 복기 관련 상태
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        setIsReady(true);
      });
    } else {
      setTimeout(() => setIsReady(true), 0); // ✅ 비동기 처리
    }
  }, []);

  const pieces = pieceBoard.flat().filter((p): p is PieceData => p !== null);
  const possibleMoves =
    selected && !isReplay ? getLegalMoves(selected, pieces) : [];

  const handleSelect = (piece: PieceData) => {
    if (isReplay) return;
    if (selected?.x === piece.x && selected?.y === piece.y) {
      setSelected(null);
    } else {
      setSelected(piece);
    }
  };

  const fetchMoves = async () => {
    const data = await getMoves(gameId);
    setMoves(data);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
  };

  const exitReplay = () => {
    setMoves([]);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
    setTurnInfo({ count: 1, turn: 'cho' });
    if (onExitReplay) onExitReplay();
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

  const movePiece = (toX: number, toY: number) => {
    if (isReplay || !selected) return;
    movePieceLogic(
      gameId,
      toX,
      toY,
      selected,
      turnInfo,
      wasCheck,
      setPieceBoard,
      setSelected,
      setGameOver, // ✅ App으로 전달
      setWinner, // ✅ App으로 전달
      setWasCheck,
      (newTurnInfo) => setTurnInfo(newTurnInfo)
    );
  };

  return (
    <>
      {isReplay && (
        <div>
          <Button onClick={fetchMoves}>히스토리 불러오기</Button>
          <Button onClick={handlePrev}>◀ 이전</Button>
          <Button onClick={handleNext}>다음 ▶</Button>
          <Button onClick={exitReplay}>복기 종료</Button>
        </div>
      )}

      <div
        className='board'
        ref={boardRef}
        style={{ visibility: isReady ? 'visible' : 'hidden' }}
      >
        {/* 9x8 셀 그리드 */}
        <div className='board-grid'>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex} className='board-row'>
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <BoardCell
                  key={`${rowIndex}-${colIndex}`}
                  x={colIndex}
                  y={rowIndex}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 기물 레이어 */}
        <div className='pieces-layer'>
          {pieceBoard.flat().map((piece, i) =>
            piece ? (
              <div
                key={`piece-${i}`}
                className={`piece-position ${
                  piece.team !== turnInfo.turn ? 'unable' : ''
                }`}
                style={{ left: `${piece.x * 60}px`, top: `${piece.y * 60}px` }}
                onClick={() => {
                  if (!isReplay) {
                    const isOpponent = piece.team !== turnInfo.turn;
                    if (!isOpponent) handleSelect(piece);
                  }
                }}
              >
                <Piece type={piece.type} team={piece.team} size={50} />
              </div>
            ) : null
          )}
        </div>

        {/* 이동 가능 위치 하이라이트 */}
        {selected &&
          !isReplay &&
          possibleMoves.map((pos, i) => (
            <div
              key={`highlight-${i}`}
              className='highlight-circle'
              style={{ left: `${pos.x * 60}px`, top: `${pos.y * 60}px` }}
              onClick={() => movePiece(pos.x, pos.y)}
            />
          ))}
      </div>
    </>
  );
};

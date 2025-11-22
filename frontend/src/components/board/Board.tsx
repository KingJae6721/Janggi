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

// 로직 모듈 import
import { getTeamByTurn, applyMoves, movePieceLogic } from './boardLogic';

type BoardProps = { gameId: number };
type TurnInfo = { count: number; turn: 'cho' | 'han' };

export const Board = ({ gameId }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [pieceBoard, setPieceBoard] =
    useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);
  const [turnInfo, setTurnInfo] = useState<TurnInfo>({ count: 1, turn: 'cho' });
  const [wasCheck, setWasCheck] = useState<{ cho: boolean; han: boolean }>({
    cho: false,
    han: false,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'cho' | 'han' | null>(null);

  // 히스토리 관련 상태
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReplay, setIsReplay] = useState(false);

  useEffect(() => {
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    setIsReplay(true);
  };

  const exitReplay = () => {
    setIsReplay(false);
    setMoves([]);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const { board, turnInfo } = applyMoves(moves, newIndex);
      setPieceBoard(board);
      setTurnInfo(turnInfo); // ✅ 턴 정보도 갱신
    }
  };

  const handleNext = () => {
    if (currentIndex < moves.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const { board, turnInfo } = applyMoves(moves, newIndex);
      setPieceBoard(board);
      setTurnInfo(turnInfo); // ✅ 턴 정보도 갱신
    }
  };

  const movePiece = (toX: number, toY: number) => {
    if (isReplay || !selected || gameOver) return;
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
      setTurnInfo
    );
  };

  return (
    <>
      {/* 히스토리 컨트롤 */}
      <Button onClick={fetchMoves}>히스토리 불러오기</Button>
      <Button onClick={handlePrev} disabled={!isReplay}>
        ◀ 이전
      </Button>
      <Button onClick={handleNext} disabled={!isReplay}>
        다음 ▶
      </Button>
      {isReplay && <Button onClick={exitReplay}>복기 종료</Button>}

      <div className='board' ref={boardRef}>
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
                  // 복기 모드에서는 클릭 자체를 막음
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

        {/* 게임 종료 배너 */}
        {gameOver && (
          <div>
            {winner
              ? `${winner === 'cho' ? '초' : '한'} 진영 승리!`
              : '무승부입니다'}
          </div>
        )}
      </div>
    </>
  );
};

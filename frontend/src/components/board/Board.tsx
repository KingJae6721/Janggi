import { useState, useEffect, useRef } from 'react';
import './Board.css';

import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';
import { Button } from '../common/Button';

import type { Move } from '../../types/move';
import type { PieceData } from '../../types/types';
import { initialBoard } from '../../constants/initialPieces';
import { getLegalMoves, isCheck } from '../../utils/janggiRules';
import { addMove, endGame, getMoves } from '../../api/gameApi';

type BoardProps = {
  gameId: number;
};

type TurnInfo = {
  count: number;
  turn: 'cho' | 'han';
};

export const Board = ({ gameId }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [pieceBoard, setPieceBoard] = useState<(PieceData | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<PieceData | null>(null);
  const [turnInfo, setTurnInfo] = useState<TurnInfo>({ count: 1, turn: 'cho' });
  const [wasCheck, setWasCheck] = useState<{ cho: boolean; han: boolean }>({ cho: false, han: false });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'cho' | 'han' | null>(null);

  // 히스토리 관련 상태
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReplay, setIsReplay] = useState(false); // 복기 모드 여부

  // 마운트 시 스크롤 이동
  useEffect(() => {
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // 현재 보드에서 기물 추출
  const pieces = pieceBoard.flat().filter((p): p is PieceData => p !== null);

  // 선택된 기물의 이동 후보 (복기 모드에서는 비활성화)
  const possibleMoves = selected && !isReplay ? getLegalMoves(selected, pieces) : [];

  // 기물 선택 핸들러
  const handleSelect = (piece: PieceData) => {
    if (isReplay) return; // 복기 모드에서는 선택 불가
    if (selected?.x === piece.x && selected?.y === piece.y) {
      setSelected(null);
    } else {
      setSelected(piece);
    }
  };

  // 이동 기록 불러오기
  const fetchMoves = async () => {
    const data = await getMoves(gameId);
    setMoves(data);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
    setIsReplay(true); // 복기 모드 활성화
  };

  // 복기 모드 종료
  const exitReplay = () => {
    setIsReplay(false);
    setMoves([]);
    setCurrentIndex(0);
    setPieceBoard(initialBoard);
  };

  // 턴 기반 팀 계산
  const getTeamByTurn = (turn: number): 'cho' | 'han' => {
    return turn % 2 === 1 ? 'cho' : 'han';
  };

  // 히스토리 적용
  const applyMoves = (index: number) => {
    const newBoard: (PieceData | null)[][] = initialBoard.map((row) => row.slice());

    moves.slice(0, index).forEach((move) => {
      const team = getTeamByTurn(move.turn);
      newBoard[move.fromY][move.fromX] = null;
      newBoard[move.toY][move.toX] = {
        type: move.piece,
        team,
        x: move.toX,
        y: move.toY,
      };
    });

    setPieceBoard(newBoard);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      applyMoves(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < moves.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      applyMoves(newIndex);
    }
  };

  // 실제 게임 중 이동 처리
  const movePiece = async (toX: number, toY: number) => {
    if (isReplay || !selected || gameOver) return; // 복기 모드에서는 실행 안 함

    let newBoard: (PieceData | null)[][] = [];

    setPieceBoard((prev) => {
      newBoard = prev.map((row) => row.slice());
      newBoard[selected.y][selected.x] = null;
      newBoard[toY][toX] = { ...selected, x: toX, y: toY };
      return newBoard;
    });

    setSelected(null);

    await addMove(gameId, {
      turn: turnInfo.count,
      piece: selected.type,
      fromX: selected.x,
      fromY: selected.y,
      toX,
      toY,
      team: selected.team,
    });

    const flatBoard = newBoard.flat().filter((p): p is PieceData => p !== null);
    const choKing = flatBoard.find((p) => p.type === '왕' && p.team === 'cho');
    const hanKing = flatBoard.find((p) => p.type === '왕' && p.team === 'han');

    if (!choKing || !hanKing) {
      setGameOver(true);
      const winnerTeam = choKing ? 'cho' : 'han';
      setWinner(winnerTeam);
      await endGame(gameId, winnerTeam);
      return;
    }

    const nextTurn = turnInfo.turn === 'cho' ? 'han' : 'cho';
    const king = flatBoard.find((p) => p.type === '왕' && p.team === nextTurn);
    const kingMoves = king ? getLegalMoves(king, flatBoard) : [];

    const canEscape = kingMoves.some((move) => {
      const simulated = flatBoard
        .filter((p) => !(p.x === move.x && p.y === move.y))
        .map((p) =>
          p.x === king?.x && p.y === king?.y ? { ...p, x: move.x, y: move.y } : { ...p }
        );
      return !isCheck(simulated, nextTurn);
    });

    if (isCheck(flatBoard, nextTurn) && !canEscape) {
      setGameOver(true);
      setWinner(turnInfo.turn);
      await endGame(gameId, turnInfo.turn);
      return;
    }

    const currentTurn = turnInfo.turn;
    const checkNow = isCheck(flatBoard, currentTurn);
    if (!checkNow && wasCheck[currentTurn]) {
      console.log('멍군!');
    }

    const nextCount = turnInfo.count + 1;
    const checkNext = isCheck(flatBoard, nextTurn);

    setWasCheck((prevWas) => ({
      ...prevWas,
      [currentTurn]: checkNow,
      [nextTurn]: checkNext,
    }));

    setTurnInfo({ count: nextCount, turn: nextTurn });
  };

  return (
    <>
      {/* 히스토리 컨트롤 */}
      <Button onClick={fetchMoves}>히스토리 불러오기</Button>
      <Button onClick={handlePrev} disabled={!isReplay}>◀ 이전</Button>
      <Button onClick={handleNext} disabled={!isReplay}>다음 ▶</Button>
      {isReplay && <Button onClick={exitReplay}>복기 종료</Button>}

      <div className="board" ref={boardRef}>
        {/* 9x8 셀 그리드 */}
        <div className="board-grid">
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <BoardCell key={`${rowIndex}-${colIndex}`} x={colIndex} y={rowIndex} />
              ))}
            </div>
          ))}
        </div>

        {/* 기물 레이어 */}
        <div className="pieces-layer">
          {pieceBoard.flat().map((piece, i) =>
            piece ? (
              <div
                key={`piece-${i}`}
                className="piece-position"
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
        
        {selected && !isReplay &&
          possibleMoves.map((pos, i) => (
            <div
              key={`highlight-${i}`}
              className="highlight-circle"
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

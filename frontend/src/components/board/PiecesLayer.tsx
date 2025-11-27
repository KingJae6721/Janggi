import { Piece } from '../pieces/Piece';
import { useGameContext } from '../../contexts/GameContext';
import type { PieceData } from '../../types/types';

type PiecesLayerProps = {
  pieceBoard: (PieceData | null)[][];
  onPieceClick: (piece: PieceData) => void;
};

export const PiecesLayer = ({ pieceBoard, onPieceClick }: PiecesLayerProps) => {
  const { turnInfo, isReplay } = useGameContext();

  return (
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
                if (!isOpponent) onPieceClick(piece);
              }
            }}
          >
            <Piece type={piece.type} team={piece.team} size={50} />
          </div>
        ) : null
      )}
    </div>
  );
};

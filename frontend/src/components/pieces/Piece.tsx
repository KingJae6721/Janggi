import { FONTS } from '../../constants/fonts';
import type { PieceType, Team } from '../../types/types';
import { pieceConfig } from './pieceConfig';
import './Piece.css';

type PieceProps = {
  type: PieceType;
  team: Team;
  size?: number; // 크기를 숫자로 받기 (기본값: 46px)
};

export const Piece = ({ type, team, size = 46 }: PieceProps) => {
  const innerSize = size * 0.87; // 테두리를 위해 안쪽 크기를 약간 작게

  return (
    <div className='piece-container'>
      <div
        className={`piece-border ${team}`}
        style={{ width: size, height: size }}
      >
        <div
          className={`piece-octagon ${team}`}
          style={{
            width: innerSize,
            height: innerSize,
            fontFamily: FONTS.piece[team],
            fontSize: size * 0.45,
          }}
        >
          {pieceConfig[type][team]}
        </div>
      </div>
    </div>
  );
};

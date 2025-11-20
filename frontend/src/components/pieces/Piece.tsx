import { pieceSizeConfig } from '../../constants/pieceSizes';
import type { PieceType, Team } from '../../types/types';
import { pieceConfig } from './pieceConfig';
import './Piece.css';

type PieceProps = {
  type: PieceType;
  team: Team;
  size?: number; // 크기를 숫자로 받기 (기본값: 46px)
};

export const Piece = ({ type, team, size = 46 }: PieceProps) => {
  // 기물 타입별 크기 조정
  const adjustedSize = size * pieceSizeConfig[type];
  const borderThickness = 2; // 테두리 두께 고정 (4px)
  const innerSize = adjustedSize - borderThickness * 2; // 양쪽 테두리 고려
  const fontSize = team === 'cho' ? adjustedSize * 0.7 : adjustedSize * 0.6; // 초 진영 글씨 더 크게

  return (
    <div className='piece-container'>
      <div
        className={`piece-border ${team}`}
        style={{ width: adjustedSize, height: adjustedSize }}
      >
        <div
          className={`piece-octagon ${team}`}
          style={{
            width: innerSize,
            height: innerSize,
            fontSize: fontSize,
          }}
        >
          {pieceConfig[type][team]}
        </div>
      </div>
    </div>
  );
};

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
  const innerSize = adjustedSize * 0.92; // 테두리 두께 줄이기 (0.87 → 0.92)
  const fontSize = team === 'cho' ? adjustedSize * 0.55 : adjustedSize * 0.45; // 초 진영 글씨 더 크게

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
            // fontFamily는 CSS에서 처리
          }}
        >
          {pieceConfig[type][team]}
        </div>
      </div>
    </div>
  );
};

import type { PieceType } from '../types/types';

// 기물 타입별 상대 크기 (1.0이 기준)
export const pieceSizeConfig: Record<PieceType, number> = {
  왕: 1.3,
  차: 1.0,
  포: 1.0,
  마: 1.0,
  상: 1.0,
  사: 0.8,
  졸: 0.8,
};

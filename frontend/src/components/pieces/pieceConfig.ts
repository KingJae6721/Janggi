import type { PieceType } from '../../types/types';

export const pieceConfig: Record<PieceType, { han: string; cho: string }> = {
  왕: { han: '漢', cho: '楚' },
  차: { han: '車', cho: '車' },
  포: { han: '包', cho: '包' },
  마: { han: '馬', cho: '馬' },
  상: { han: '象', cho: '象' },
  사: { han: '士', cho: '士' },
  졸: { han: '卒', cho: '卒' },
};

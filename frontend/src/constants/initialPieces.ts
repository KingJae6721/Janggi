import type { PieceData } from '../types/types';

// 초기 기물 배치
export const initialPieces: PieceData[] = [
  // 초 진영 (위쪽 - y: 0~3)
  // 1줄: 차, 상, 마, 사, (빈칸), 사, 마, 상, 차
  { type: '차', team: 'cho', x: 0, y: 0 },
  { type: '상', team: 'cho', x: 1, y: 0 },
  { type: '마', team: 'cho', x: 2, y: 0 },
  { type: '사', team: 'cho', x: 3, y: 0 },
  // x: 4, y: 0 은 빈칸
  { type: '사', team: 'cho', x: 5, y: 0 },
  { type: '마', team: 'cho', x: 6, y: 0 },
  { type: '상', team: 'cho', x: 7, y: 0 },
  { type: '차', team: 'cho', x: 8, y: 0 },

  // 2줄: 왕 (중앙)
  { type: '왕', team: 'cho', x: 4, y: 1 },

  // 3줄: 포 2개
  { type: '포', team: 'cho', x: 1, y: 2 },
  { type: '포', team: 'cho', x: 7, y: 2 },

  // 4줄: 졸 5개
  { type: '졸', team: 'cho', x: 0, y: 3 },
  { type: '졸', team: 'cho', x: 2, y: 3 },
  { type: '졸', team: 'cho', x: 4, y: 3 },
  { type: '졸', team: 'cho', x: 6, y: 3 },
  { type: '졸', team: 'cho', x: 8, y: 3 },

  // 한 진영 (아래쪽 - y: 6~9)
  // 7줄: 졸 5개
  { type: '졸', team: 'han', x: 0, y: 6 },
  { type: '졸', team: 'han', x: 2, y: 6 },
  { type: '졸', team: 'han', x: 4, y: 6 },
  { type: '졸', team: 'han', x: 6, y: 6 },
  { type: '졸', team: 'han', x: 8, y: 6 },

  // 8줄: 포 2개
  { type: '포', team: 'han', x: 1, y: 7 },
  { type: '포', team: 'han', x: 7, y: 7 },

  // 9줄: 왕 (중앙)
  { type: '왕', team: 'han', x: 4, y: 8 },

  // 10줄: 차, 상, 마, 사, (빈칸), 사, 마, 상, 차
  { type: '차', team: 'han', x: 0, y: 9 },
  { type: '상', team: 'han', x: 1, y: 9 },
  { type: '마', team: 'han', x: 2, y: 9 },
  { type: '사', team: 'han', x: 3, y: 9 },
  // x: 4, y: 9 은 빈칸
  { type: '사', team: 'han', x: 5, y: 9 },
  { type: '마', team: 'han', x: 6, y: 9 },
  { type: '상', team: 'han', x: 7, y: 9 },
  { type: '차', team: 'han', x: 8, y: 9 },
];

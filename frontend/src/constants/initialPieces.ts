import type { PieceData } from '../types/types';

// 10행 × 9열 (y: 0~9, x: 0~8)
export const initialBoard: (PieceData | null)[][] = [
  // y = 0 (초 진영 첫 줄)
  [
    { type: '차', team: 'cho', x: 0, y: 0 },
    { type: '상', team: 'cho', x: 1, y: 0 },
    { type: '마', team: 'cho', x: 2, y: 0 },
    { type: '사', team: 'cho', x: 3, y: 0 },
    null,
    { type: '사', team: 'cho', x: 5, y: 0 },
    { type: '마', team: 'cho', x: 6, y: 0 },
    { type: '상', team: 'cho', x: 7, y: 0 },
    { type: '차', team: 'cho', x: 8, y: 0 },
  ],
  // y = 1
  [
    null,
    null,
    null,
    null,
    { type: '왕', team: 'cho', x: 4, y: 1 },
    null,
    null,
    null,
    null,
  ],
  // y = 2
  [
    null,
    { type: '포', team: 'cho', x: 1, y: 2 },
    null,
    null,
    null,
    null,
    null,
    { type: '포', team: 'cho', x: 7, y: 2 },
    null,
  ],
  // y = 3
  [
    { type: '졸', team: 'cho', x: 0, y: 3 },
    null,
    { type: '졸', team: 'cho', x: 2, y: 3 },
    null,
    { type: '졸', team: 'cho', x: 4, y: 3 },
    null,
    { type: '졸', team: 'cho', x: 6, y: 3 },
    null,
    { type: '졸', team: 'cho', x: 8, y: 3 },
  ],
  // y = 4, 5 (빈 줄)
  Array(9).fill(null),
  Array(9).fill(null),
  // y = 6 (한 진영 졸)
  [
    { type: '졸', team: 'han', x: 0, y: 6 },
    null,
    { type: '졸', team: 'han', x: 2, y: 6 },
    null,
    { type: '졸', team: 'han', x: 4, y: 6 },
    null,
    { type: '졸', team: 'han', x: 6, y: 6 },
    null,
    { type: '졸', team: 'han', x: 8, y: 6 },
  ],
  // y = 7 (한 진영 포)
  [
    null,
    { type: '포', team: 'han', x: 1, y: 7 },
    null,
    null,
    null,
    null,
    null,
    { type: '포', team: 'han', x: 7, y: 7 },
    null,
  ],
  // y = 8 (한 진영 왕)
  [
    null,
    null,
    null,
    null,
    { type: '왕', team: 'han', x: 4, y: 8 },
    null,
    null,
    null,
    null,
  ],
  // y = 9 (한 진영 마지막 줄)
  [
    { type: '차', team: 'han', x: 0, y: 9 },
    { type: '상', team: 'han', x: 1, y: 9 },
    { type: '마', team: 'han', x: 2, y: 9 },
    { type: '사', team: 'han', x: 3, y: 9 },
    null,
    { type: '사', team: 'han', x: 5, y: 9 },
    { type: '마', team: 'han', x: 6, y: 9 },
    { type: '상', team: 'han', x: 7, y: 9 },
    { type: '차', team: 'han', x: 8, y: 9 },
  ],
];

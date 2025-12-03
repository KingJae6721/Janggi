import { PieceData } from 'src/game/janggi-rules.service';

export const INITIAL_BOARD: PieceData[] = [
  // cho (위쪽)
  { type: '차', team: 'cho', x: 0, y: 0 },
  { type: '상', team: 'cho', x: 1, y: 0 },
  { type: '마', team: 'cho', x: 2, y: 0 },
  { type: '사', team: 'cho', x: 3, y: 0 },
  { type: '왕', team: 'cho', x: 4, y: 1 },
  { type: '사', team: 'cho', x: 5, y: 0 },
  { type: '마', team: 'cho', x: 6, y: 0 },
  { type: '상', team: 'cho', x: 7, y: 0 },
  { type: '차', team: 'cho', x: 8, y: 0 },

  { type: '포', team: 'cho', x: 1, y: 2 },
  { type: '포', team: 'cho', x: 7, y: 2 },
  { type: '졸', team: 'cho', x: 0, y: 3 },
  { type: '졸', team: 'cho', x: 2, y: 3 },
  { type: '졸', team: 'cho', x: 4, y: 3 },
  { type: '졸', team: 'cho', x: 6, y: 3 },
  { type: '졸', team: 'cho', x: 8, y: 3 },

  // han (아래쪽)
  { type: '차', team: 'han', x: 0, y: 9 },
  { type: '마', team: 'han', x: 2, y: 9 },
  { type: '상', team: 'han', x: 1, y: 9 },
  { type: '사', team: 'han', x: 3, y: 9 },
  { type: '왕', team: 'han', x: 4, y: 8 },
  { type: '사', team: 'han', x: 5, y: 9 },
  { type: '마', team: 'han', x: 6, y: 9 },
  { type: '상', team: 'han', x: 7, y: 9 },
  { type: '차', team: 'han', x: 8, y: 9 },

  { type: '포', team: 'han', x: 1, y: 7 },
  { type: '포', team: 'han', x: 7, y: 7 },
  { type: '졸', team: 'han', x: 0, y: 6 },
  { type: '졸', team: 'han', x: 2, y: 6 },
  { type: '졸', team: 'han', x: 4, y: 6 },
  { type: '졸', team: 'han', x: 6, y: 6 },
  { type: '졸', team: 'han', x: 8, y: 6 },
];

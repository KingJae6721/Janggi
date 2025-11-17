type PieceType = '차' | '포' | '마' | '상' | '사' | '졸' | '왕';
type Team = 'han' | 'cho';

type PieceData = {
  type: PieceType;
  team: Team;
  x: number;
  y: number;
};

export type { PieceType, Team, PieceData };

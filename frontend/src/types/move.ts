// 프론트에서 사용하는 Move 타입
export interface Move {
  id?: number;              // DB에서 자동 생성
  gameId?: number;          // 어떤 게임에 속하는지
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  piece: '차' | '마' | '상' | '포' | '졸' | '왕' | '사';
  team: 'han' | 'cho';
  createdAt?: string;       // 서버에서 내려주는 경우
  turn : number;
}

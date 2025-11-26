import axios from 'axios';
import type { Move } from '../types/move';

export const getBoard = async () => {
  const res = await axios.get('/game/board');
  return res.data;
};

export const createGame = async (player1: string, player2: string) => {
  const res = await axios.post('/game', { player1, player2 });
  return res.data;
};

export const addMove = async (gameId: number, moveData: Partial<Move>) => {
  const res = await axios.post(`/game/${gameId}/moves`, moveData);
  return res.data;
};

export const endGame = async (gameId: number, winner: string) => {
  const res = await axios.put(`/game/${gameId}/end`, { winner });
  return res.data;
};
// 특정 게임의 이동 기록 조회
export const getMoves = async (gameId: number) => {
  const res = await axios.get<Move[]>(`/game/${gameId}/moves`);
  return res.data;
};

// frontend/api/gameApi.ts
export async function getGamesByPlayer(playerName: string) {
  const res = await fetch(`http://localhost:3000/game/player/${playerName}`);
  if (!res.ok) {
    throw new Error('게임 목록을 불러오지 못했습니다');
  }
  return await res.json();
}

// 이동 검증
export const validateMove = async (
  from: { x: number; y: number },
  to: { x: number; y: number },
  board: any[]
): Promise<{ valid: boolean; message?: string }> => {
  const res = await axios.post('/game/validate-move', { from, to, board });
  return res.data;
};

// 이동 가능한 위치 조회
export const getPossibleMoves = async (
  from: { x: number; y: number },
  board: any[]
): Promise<{ x: number; y: number }[]> => {
  const res = await axios.post('/game/possible-moves', { from, board });
  return res.data;
};

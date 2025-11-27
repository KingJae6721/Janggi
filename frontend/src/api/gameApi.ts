import axios from 'axios';
import type { Move } from '../types/move';

/** 특정 게임의 현재 보드 상태 조회 */
export const getBoard = async (gameId: number) => {
  const res = await axios.get(`/games/${gameId}/board`);
  return res.data;
};

/** 새 게임 생성 */
export const createGame = async (player1: string, player2: string) => {
  const res = await axios.post('/games', { player1, player2 });
  return res.data;
};

/** 특정 게임에 이동 추가 */
export const addMove = async (gameId: number, moveData: Partial<Move>) => {
  const res = await axios.post(`/games/${gameId}/moves`, moveData);
  return res.data;
};

/** 특정 게임 종료 */
export const endGame = async (gameId: number, winner: string) => {
  const res = await axios.patch(`/games/${gameId}/end`, { winner });
  return res.data;
};

/** 특정 게임의 이동 기록 조회 */
export const getMoves = async (gameId: number) => {
  const res = await axios.get<Move[]>(`/games/${gameId}/moves`);
  return res.data;
};

/** 특정 플레이어의 게임 목록 조회 */
export async function getGamesByPlayer(playerName: string) {
  const res = await fetch(`/games/players/${playerName}`);
  if (!res.ok) {
    throw new Error('게임 목록을 불러오지 못했습니다');
  }
  return await res.json();
}

/** 특정 게임에서 말의 가능한 이동 조회 */
export const getPossibleMoves = async (
  gameId: number,
  from: { x: number; y: number }
): Promise<{ x: number; y: number }[]> => {
  const res = await axios.get(`/games/${gameId}/pieces/${from.x}/${from.y}/possible-moves`);
  return res.data;
};

/** 특정 게임에서 이동 검증 */
export const validateMove = async (
  gameId: number,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Promise<{ valid: boolean; message?: string }> => {
  const res = await axios.post(`/games/${gameId}/moves/validate`, { from, to });
  return res.data;
};
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

  
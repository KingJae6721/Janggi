import { useState } from 'react';
import type { Team } from '../types/types';
import { createGame } from '../api/gameApi';

export const useGameState = () => {
  const [turnInfo, setTurnInfo] = useState<{ count: number; turn: Team }>({
    count: 1,
    turn: 'cho',
  });
  const [isReplay, setIsReplay] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'cho' | 'han' | null>(null);

  const handleNewGame = () => {
    setTurnInfo({ count: 1, turn: 'cho' });
    setIsEnabled(false);
    setGameId(null);
    setPlayer1Name('');
    setPlayer2Name('');
    setIsReplay(false);
    setGameOver(false);
    setWinner(null);
  };

  const startNewGame = async () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsEnabled(true);
      const game = await createGame(player1Name, player2Name);
      setGameId(game.id);
    }
  };

  const selectGame = (game: { id: number; player1: string; player2: string }) => {
    setGameId(game.id);
    setPlayer1Name(game.player1);
    setPlayer2Name(game.player2);
    setIsReplay(true);
    setIsEnabled(true);
    setTurnInfo({ count: 1, turn: 'cho' });
  };

  return {
    turnInfo,
    setTurnInfo,
    isReplay,
    setIsReplay,
    isEnabled,
    setIsEnabled,
    player1Name,
    setPlayer1Name,
    player2Name,
    setPlayer2Name,
    gameId,
    setGameId,
    gameOver,
    setGameOver,
    winner,
    setWinner,
    handleNewGame,
    startNewGame,
    selectGame,
    isDisabled: !player1Name.trim() || !player2Name.trim(),
  };
};

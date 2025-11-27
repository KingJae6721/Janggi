import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useModalManager } from '../hooks/useModalManager';

type GameContextType = ReturnType<typeof useGameState> &
  ReturnType<typeof useModalManager>;

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const gameState = useGameState();
  const modalManager = useModalManager();

  const value = {
    ...gameState,
    ...modalManager,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

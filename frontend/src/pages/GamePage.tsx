import { GameProvider } from '../contexts/GameContext';
import { useGameContext } from '../contexts/GameContext';
import { GameLayout } from '../components/GameLayout';
import { GameStartModals } from '../components/Modal/GameStartModals';
import { GameWinnerModal } from '../components/Modal/GameWinnerModal';

const GamePageContent = () => {
  const { isEnabled, gameOver } = useGameContext();

  return (
    <>
      <GameLayout />

      {!isEnabled && <GameStartModals />}

      {gameOver && <GameWinnerModal />}
    </>
  );
};

export const GamePage = () => {
  return (
    <GameProvider>
      <GamePageContent />
    </GameProvider>
  );
};

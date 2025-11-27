import { InfoBox } from './InfoBox/InfoBox';
import { Board } from './board/Board';
import Title from './common/Title';
import GameInfoBox from './InfoBox/GameInfoBox';
import TeamInfoBox from './InfoBox/TeamInfoBox';
import { useGameContext } from '../contexts/GameContext';

export const GameLayout = () => {
  const {
    isEnabled,
    gameId,
    turnInfo,
    setTurnInfo,
    isReplay,
    setIsReplay,
    setWinner,
    setGameOver,
    handleNewGame,
    player1Name,
    player2Name,
  } = useGameContext();

  return (
    <div
      className='main-container'
      style={{
        pointerEvents: isEnabled ? 'auto' : 'none',
        opacity: isEnabled ? 1 : 0.5,
      }}
    >
      <Title />

      {gameId !== null && (
        <InfoBox>
          <TeamInfoBox
            currentPlayer={turnInfo.turn}
            turnCount={turnInfo.count}
            handleNewGame={handleNewGame}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        </InfoBox>
      )}

      <div className='board-container'>
        {gameId !== null && <Board />}
      </div>

      {gameId !== null && (
        <InfoBox>
          <GameInfoBox />
        </InfoBox>
      )}
    </div>
  );
};

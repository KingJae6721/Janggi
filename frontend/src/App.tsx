import { useEffect, useState } from 'react';
import './App.css';
import { InfoBox } from './components/InfoBox/InfoBox';
import { Board } from './components/board/Board';
import { COLORS } from './constants/colors';
import type { Team } from './types/types';
import { Modal } from './components/Modal/Modal';
import { PlayerInputModal } from './components/Modal/PlayerInputModal';
import { createGame } from './api/gameApi';
import GameInfoBox from './components/InfoBox/GameInfoBox';
import TeamInfoBox from './components/InfoBox/TeamInfoBox';
import WinnerShowModal from './components/Modal/WinnerShowModal';
import Title from './components/common/Title';

function App() {
  // ✅ 턴과 카운트를 App에서 관리
  const [turnInfo, setTurnInfo] = useState<{ count: number; turn: Team }>({
    count: 1,
    turn: 'cho',
  });

  const [isEnabled, setIsEnabled] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);

  const handleNewGame = () => {
    setTurnInfo({ count: 1, turn: 'cho' }); // ✅ 새 게임 시 초기화
  };

  const startNewGame = async () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsEnabled(true);
      const game = await createGame(player1Name, player2Name);
      setGameId(game.id);
    }
  };

  return (
    <>
      <div
        className='main-container'
        style={{
          pointerEvents: isEnabled ? 'auto' : 'none',
          opacity: isEnabled ? 1 : 0.5,
        }}
      >
        <Title />
        <InfoBox>
          <TeamInfoBox
            currentPlayer={turnInfo.turn}
            turnCount={turnInfo.count}
            handleNewGame={handleNewGame}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        </InfoBox>

        <div className='board-container'>
          {gameId !== null && (
            <Board
              gameId={gameId}
              turnInfo={turnInfo}
              setTurnInfo={setTurnInfo} // ✅ Board에서 턴 변경 시 App으로 반영
              setPlayer1Name={setPlayer1Name}  
              setPlayer2Name={setPlayer2Name}  
            />
          )}
        </div>

        <InfoBox>
          <GameInfoBox />
        </InfoBox>
      </div>

      {!isEnabled && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <Modal backgroundColor={COLORS.background}>
            <PlayerInputModal
              player1Name={player1Name}
              player2Name={player2Name}
              onPlayer1Change={setPlayer1Name}
              onPlayer2Change={setPlayer2Name}
              onStartGame={startNewGame}
            />
          </Modal>
          <Modal
            width='550px'
            height='300px'
            backgroundColor='#ffe270'
            border='4px solid #dcb000'
          >
            <WinnerShowModal currentPlayer={turnInfo.turn} />
          </Modal>
        </div>
      )}
    </>
  );
}

export default App;

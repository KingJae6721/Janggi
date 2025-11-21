import { useEffect, useState } from 'react';
import './App.css';
// import { ComponentPreview } from './pages/ComponentPreview';
import { InfoBox } from './components/InfoBox/InfoBox';
import { Board } from './components/board/Board';
import { COLORS } from './constants/colors';
import type { Team } from './types/types';
import { Modal } from './components/Modal/Modal';
import { PlayerInputModal } from './components/Modal/PlayerInputModal';
import { getBoard, createGame, addMove } from './api/gameApi';
import GameInfoBox from './components/InfoBox/GameInfoBox';
import TeamInfoBox from './components/InfoBox/TeamInfoBox';
import WinnerShowModal from './components/Modal/WinnerShowModal';
import Title from './components/common/Title';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Team>('cho'); // 초 또는 한
  const [isEnabled, setIsEnabled] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  useEffect(() => {
    fetch('http://localhost:3000/game/board')
      .then((res) => res.json())
      .then((data) => {
        console.log('현재 보드 상태:', data);
      });
  }, []);

  const handleNewGame = () => {
    setCurrentPlayer('cho'); // 게임 초기화 시 초부터 시작
  };

  const startNewGame = async () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsEnabled(true);
      const game = await createGame(player1Name, player2Name);
      setGameId(game.id); // ✅ 생성된 게임의 ID 저장
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
        {/* <ComponentPreview /> */}
        <Title />
        <InfoBox>
          <TeamInfoBox
            currentPlayer={currentPlayer}
            handleNewGame={handleNewGame}
          />
        </InfoBox>

        <div className='board-container'>
          {gameId !== null && <Board gameId={gameId} />}
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
            <WinnerShowModal currentPlayer={currentPlayer} />
          </Modal>
        </div>
      )}
    </>
  );
}

export default App;

import { useEffect, useState } from 'react';
import './App.css';
// import { ComponentPreview } from './pages/ComponentPreview';
import { InfoBox } from './components/common/InfoBox';
import { Button } from './components/common/Button';
import { Board } from './components/board/Board';
import { COLORS } from './constants/colors';
import type { Team } from './types/types';
import { Piece } from './components/pieces/Piece';
import { Modal } from './components/common/Modal';
import InputText from './components/common/InputText';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Team>('cho'); // 초 또는 한
  const [isVisible, setIsVisible] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/game/state')
      .then((res) => res.json())
      .then((data) => {
        console.log('현재 보드 상태:', data);
      });
  }, []);

  const handleNewGame = () => {
    setCurrentPlayer('cho'); // 게임 초기화 시 초부터 시작
  };

  const startNewGame = () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsEnabled(true);
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
        <div className='title-container'>
          <h1 style={{ color: COLORS.ui.text }}>장기 (Janggi)</h1>
          <h3 style={{ color: COLORS.ui.textSecondary }}>Korean Chess</h3>
        </div>
        <InfoBox>
          <div className='infobox-container'>
            <Piece type='왕' team={currentPlayer} size={48} />
            <p
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: COLORS.team[currentPlayer],
              }}
            >
              {currentPlayer === 'cho' ? '초' : '한'}의 차례입니다
            </p>
            <Button onClick={handleNewGame}>새 게임</Button>
          </div>
        </InfoBox>

        <div className='board-container'>{isVisible && <Board />}</div>
        <InfoBox>
          <h3>게임 방법:</h3>
          <ul className='game-information'>
            <li>
              자신의 기물을 클릭하여 선택하고, 이동 가능한 위치를 확인하세요
            </li>
            <li>파란 점이 표시된 위치로 이동할 수 있습니다</li>
            <li>상대의 왕을 잡으면 승리합니다</li>
            <li>초는 녹색, 한은 빨간색으로 표시됩니다</li>
          </ul>
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
          <Modal width='550px' height='500px' backgroundColor='#FFF8DC'>
            <h2
              style={{
                color: COLORS.ui.text,
                margin: '0 0 8px 0',
                fontSize: '24px',
              }}
            >
              장기 게임에 오신 것을 환영합니다!
            </h2>
            <p
              style={{
                color: COLORS.ui.textSecondary,
                fontSize: '14px',
              }}
            >
              플레이어 이름을 입력하고 게임을 시작하세요.
            </p>
            <div className='input-container'>
              <div className='input-wrapper'>
                <label className='player-label cho'>초 진영 (선공)</label>
                <InputText
                  placeholder='초 진영의 이름을 입력하세요'
                  value={player1Name}
                  onChange={setPlayer1Name}
                  borderColor='#2e7d32'
                />
                <p className='input-note'>* 초 진영이 먼저 시작합니다</p>
              </div>
              <div className='input-wrapper'>
                <label className='player-label han'>한 진영 (후공)</label>
                <InputText
                  placeholder='한 진영의 이름을 입력하세요'
                  value={player2Name}
                  onChange={setPlayer2Name}
                  borderColor='#c62828'
                />
              </div>
            </div>
            <Button
              onClick={() => startNewGame()}
              disabled={!player1Name.trim() || !player2Name.trim()}
            >
              게임 시작
            </Button>
          </Modal>
        </div>
      )}
    </>
  );
}

export default App;

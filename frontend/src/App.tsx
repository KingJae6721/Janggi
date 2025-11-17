import { useEffect, useState } from 'react';
import './App.css';
import { ComponentPreview } from './pages/ComponentPreview';
import { InfoBox } from './components/common/InfoBox';
import { Button } from './components/common/Button';
import { Board } from './components/board/Board';
import { COLORS } from './constants/colors';
import type { Team } from './types/types';
import { Piece } from './components/pieces/Piece';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Team>('cho'); // 초 또는 한

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

  return (
    <div className='main-container'>
      <ComponentPreview />
      {/* <div className='title-container'>
        <h1 style={{ color: COLORS.ui.text }}>장기 (Janggi)</h1>
        <h3 style={{ color: COLORS.ui.textSecondary }}>Korean Chess</h3>
      </div>

      <InfoBox>
        <div className='infobox-container'>
          <Piece type='왕' team={currentPlayer} size={48} />
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            현재 플레이어 :{' '}
            {currentPlayer === 'cho' ? '초 (녹색)' : '한 (빨강)'}
          </p>
          <Button onClick={handleNewGame}>새 게임</Button>
        </div>
      </InfoBox>

      <div className='board-container'>
        <Board></Board>
      </div>
      <InfoBox>
        <h3>게임 방법:</h3>
        <p>• 자신의 기물을 클릭하여 선택하고, 이동 가능한 위치를 확인하세요</p>
        <p>• 파란 점이 표시된 위치로 이동할 수 있습니다</p>
        <p>• 상대의 왕을 잡으면 승리합니다</p>
        <p>• 초는 녹색, 한은 빨간색으로 표시됩니다</p>
      </InfoBox> */}
    </div>
  );
}

export default App;

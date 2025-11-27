import { useGameContext } from '../../../contexts/GameContext';
import { COLORS } from '../../../constants/colors';
import InputText from '../../common/InputText';
import { Button } from '../../common/Button';
import './PlayerInputModal.css';


export const PlayerInputContent = () => {
  const { player1Name, setPlayer1Name, player2Name, setPlayer2Name, isDisabled,startNewGame} =
    useGameContext();

 
  const handleEnter = () => {
    if (!isDisabled) {
      startNewGame();
    }
  };

  return (
    <>
      <h2 style={{ color: COLORS.ui.text }}>장기 게임에 오신 것을 환영합니다!</h2>
      <p style={{ color: COLORS.ui.textSecondary }}>
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
            autoFocus
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
            onEnter={handleEnter}
          />
        </div>
      </div>

    </>
  );
};

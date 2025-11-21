import { COLORS } from '../../constants/colors';
import InputText from '../common/InputText';
import { Button } from '../common/Button';
import './PlayerInputModal.css';
import { useRef } from 'react';

interface PlayerInputModalProps {
  player1Name: string;
  player2Name: string;
  onPlayer1Change: (value: string) => void;
  onPlayer2Change: (value: string) => void;
  onStartGame: () => void;
}

export function PlayerInputModal({
  player1Name,
  player2Name,
  onPlayer1Change,
  onPlayer2Change,
  onStartGame,
}: PlayerInputModalProps) {
  const isDisabled = !player1Name.trim() || !player2Name.trim();
  const player2InputRef = useRef<HTMLInputElement>(null);

  const handleEnter = () => {
    // 두 이름이 모두 입력되었을 때만 게임 시작
    if (!isDisabled) {
      onStartGame();
    }
  };

  return (
    <>
      <h2
        style={{
          color: COLORS.ui.text,
        }}
      >
        장기 게임에 오신 것을 환영합니다!
      </h2>
      <p
        style={{
          color: COLORS.ui.textSecondary,
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
            onChange={onPlayer1Change}
            borderColor='#2e7d32'
            onEnter={() => player2InputRef.current?.focus()}
            autoFocus
          />
          <p className='input-note'>* 초 진영이 먼저 시작합니다</p>
        </div>
        <div className='input-wrapper'>
          <label className='player-label han'>한 진영 (후공)</label>
          <InputText
            ref={player2InputRef}
            placeholder='한 진영의 이름을 입력하세요'
            value={player2Name}
            onChange={onPlayer2Change}
            borderColor='#c62828'
            onEnter={handleEnter}
          />
        </div>
      </div>
      <Button onClick={onStartGame} disabled={isDisabled}>
        게임 시작
      </Button>
    </>
  );
}

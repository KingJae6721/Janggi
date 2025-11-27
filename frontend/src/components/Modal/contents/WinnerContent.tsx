import { useGameContext } from '../../../contexts/GameContext';
import './WinnerShowModal.css';

export const WinnerContent = () => {
  const { winner, player1Name, player2Name } = useGameContext();

  if (!winner) return null;

  const winnerName = winner === 'cho' ? player1Name : player2Name;

  return (
    <div className="winner-info">
      <h2>게임 종료!</h2>
      <p>
        승자는 {winnerName} ({winner === 'cho' ? '초' : '한'}) 입니다 🎉
      </p>
    </div>
  );
};

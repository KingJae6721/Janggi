import { COLORS } from '../../constants/colors';
import './WinnerShowModal.css';

type WinnerShowModalProps = {
  currentPlayer: 'cho' | 'han';
  winnerName: string;
};

const WinnerShowModal = ({ currentPlayer, winnerName }: WinnerShowModalProps) => {
  return (
    <div>
      <h2>게임 종료!</h2>
      <p>
        승자는 {winnerName} ({currentPlayer === 'cho' ? '초' : '한'}) 입니다 🎉
      </p>
    </div>
  );
};

export default WinnerShowModal;
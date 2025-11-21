import { COLORS } from '../../constants/colors';
import './WinnerShowModal.css';

const WinnerShowModal = ({
  currentPlayer,
}: {
  currentPlayer: 'cho' | 'han';
}) => {
  return (
    <>
      <p style={{ color: COLORS.team[currentPlayer] }} className='winner-info'>
        "이긴플레이어"가 이겼습니다!
      </p>
      {/* currentPlayer 대신 이긴 플레이어의 이름을 넣어주세요 */}
    </>
  );
};

export default WinnerShowModal;

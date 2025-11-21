import { COLORS } from '../../constants/colors';
import { Piece } from '../pieces/Piece';
import { Button } from '../common/Button';
import './TeamInfoBox.css'; // ✅ CSS import 추가

type TeamInfoBoxProps = {
  currentPlayer: 'cho' | 'han';
  handleNewGame: () => void;
};

const TeamInfoBox = ({ currentPlayer, handleNewGame }: TeamInfoBoxProps) => {
  return (
    <div>
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
    </div>
  );
};

export default TeamInfoBox;

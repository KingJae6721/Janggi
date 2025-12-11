import { COLORS } from '../../constants/colors';
import { Piece } from '../pieces/Piece';
import { Button } from '../common/Button';
import './TeamInfoBox.css'; // ✅ CSS import 추가

type TeamInfoBoxProps = {
  currentPlayer: 'cho' | 'han';
  turnCount: number; // ✅ 추가
  handleNewGame: () => void;
  player1Name: string;
  player2Name: string;
};

const TeamInfoBox = ({
  currentPlayer,
  handleNewGame,
  turnCount,
  player1Name,
  player2Name
}: TeamInfoBoxProps) => {
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
          {/* TODO : 디자인 수정해주십쇼 */}
          {turnCount}수   {currentPlayer === 'cho' ? `${player1Name}(초)`:`${player2Name}(한)`}의 차례입니다
        </p>
        <Button onClick={handleNewGame}>새 게임</Button>
      </div>
    </div>
  );
};

export default TeamInfoBox;

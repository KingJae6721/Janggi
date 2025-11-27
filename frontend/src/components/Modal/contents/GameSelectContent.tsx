import { useState } from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { COLORS } from '../../../constants/colors';
import InputText from '../../common/InputText';
import { Button } from '../../common/Button';
import { getGamesByPlayer } from '../../../api/gameApi';

type Game = {
  id: number;
  player1: string;
  player2: string;
  startedAt: string;
  endedAt: string;
  winner: string;
};

export const GameSelectContent = () => {
  const { selectGame } = useGameContext();
  const [playerName, setPlayerName] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const name = playerName.trim();
    if (!name) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await getGamesByPlayer(name);
      setGames(data);
    } catch (e) {
      setError('게임 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ color: COLORS.ui.text }}>내 게임 찾기</h2>
      <p style={{ color: COLORS.ui.textSecondary }}>
        닉네임을 입력하고 내 게임 목록을 불러오세요.
      </p>

      <div className='input-container' style={{ marginBottom: '12px' }}>
        <InputText
          placeholder='내 닉네임을 입력하세요'
          value={playerName}
          onChange={setPlayerName}
          borderColor='#4a90e2'
          onEnter={handleSearch}
          autoFocus
        />
      </div>

      <Button onClick={handleSearch} disabled={loading || !playerName.trim()}>
        {loading ? '불러오는 중...' : '게임 목록 불러오기'}
      </Button>

      {error && <p style={{ color: '#c62828', marginTop: '8px' }}>{error}</p>}

      <div
        className='game-list'
        style={{
          marginTop: '16px',
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px',
        }}
      >
        {games.length === 0 && !loading ? (
          <p style={{ color: COLORS.ui.textSecondary }}>
            게임 기록이 없습니다. 닉네임을 확인하고 다시 시도하세요.
          </p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              className='game-item'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <span style={{ color: COLORS.ui.text }}>
                <p>
                  상대: {game.player1 === playerName ? game.player2 : game.player1}
                </p>
                <p>날짜: {new Date(game.startedAt).toLocaleString()}</p>
                {game.winner ? (
                  <p>
                    {game.winner == 'cho' ? `${game.player1}(초)` : `${game.player2}(한)`}{' '}
                    승
                  </p>
                ) : (
                  '진행중'
                )}
              </span>
              <Button onClick={() => selectGame(game)}>복기 시작</Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

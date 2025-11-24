import { useEffect, useState } from 'react';
import './App.css';
import { InfoBox } from './components/InfoBox/InfoBox';
import { Board } from './components/board/Board';
import { COLORS } from './constants/colors';
import type { Team } from './types/types';
import { Modal } from './components/Modal/Modal';
import { PlayerInputModal } from './components/Modal/PlayerInputModal';
import { createGame } from './api/gameApi';
import GameInfoBox from './components/InfoBox/GameInfoBox';
import TeamInfoBox from './components/InfoBox/TeamInfoBox';
import WinnerShowModal from './components/Modal/WinnerShowModal';
import Title from './components/common/Title';
import { GameSelectModal } from './components/Modal/GameSelectModal';

// ✅ Framer Motion import
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './components/common/Button';

function App() {
  const [turnInfo, setTurnInfo] = useState<{ count: number; turn: Team }>({
    count: 1,
    turn: 'cho',
  });
  const [isReplay, setIsReplay] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'cho' | 'han' | null>(null);

  // ✅ 모달 상태: player 입력 / game 선택
  const [activeModal, setActiveModal] = useState<'player' | 'game'>('player');

  const handleNewGame = () => {
    setTurnInfo({ count: 1, turn: 'cho' });
    setIsEnabled(false);
    setGameId(null);
    setPlayer1Name('');
    setPlayer2Name('');
    setIsReplay(false);
    setGameOver(false);
    setActiveModal('player'); // 새 게임 시 player 모달부터
  };

  const startNewGame = async () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsEnabled(true);
      const game = await createGame(player1Name, player2Name);
      setGameId(game.id);
    }
  };

  // ✅ 애니메이션 variants
  const modalVariants = {
    enterRight: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exitLeft: { x: '-100%', opacity: 0 },
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
        <Title />
        {gameId !== null && (
          <InfoBox>
            <TeamInfoBox
              currentPlayer={turnInfo.turn}
              turnCount={turnInfo.count}
              handleNewGame={handleNewGame}
              player1Name={player1Name}
              player2Name={player2Name}
            />
          </InfoBox>
        )}

        <div className='board-container'>
          {gameId !== null && (
            <Board
              gameId={gameId}
              turnInfo={turnInfo}
              setTurnInfo={setTurnInfo}
              isReplay={isReplay}
              onExitReplay={() => setIsReplay(false)}
              setWinner={setWinner}
              setGameOver={setGameOver}
            />
          )}
        </div>

        {gameId !== null && (
          <InfoBox>
            <GameInfoBox />
          </InfoBox>
        )}
      </div>

      {!isEnabled && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: '600px',
          }}
        >
          <AnimatePresence mode='wait'>
            {activeModal === 'player' && (
              <motion.div
                key='player'
                initial='enterRight'
                animate='center'
                exit='exitLeft'
                variants={modalVariants}
                transition={{ duration: 0.5 }}
              >
                <Modal backgroundColor={COLORS.background}>
                  <PlayerInputModal
                    player1Name={player1Name}
                    player2Name={player2Name}
                    onPlayer1Change={setPlayer1Name}
                    onPlayer2Change={setPlayer2Name}
                    onStartGame={startNewGame} // 버튼 누르면 GameSelectModal로 전환
                  />
                </Modal>
              </motion.div>
            )}

            {activeModal === 'game' && (
              <motion.div
                key='game'
                initial='enterRight'
                animate='center'
                exit='exitLeft'
                variants={modalVariants}
                transition={{ duration: 0.5 }}
              >
                <Modal>
                  <GameSelectModal
                    onSelectGame={(game) => {
                      setGameId(game.id);
                      setPlayer1Name(game.player1);
                      setPlayer2Name(game.player2);
                      setIsReplay(true);
                      setIsEnabled(true);
                      setTurnInfo({ count: 1, turn: 'cho' });
                    }}
                    onCancel={() => 1} // 닫기 → 다시 player 모달
                  />
                </Modal>
              </motion.div>
            )}
          </AnimatePresence>
          {/* 왼쪽 화살표 */}
          <div className='replay_button'>
            <Button
              onClick={() =>
                setActiveModal(activeModal == 'player' ? 'game' : 'player')
              }
            >
              {activeModal == 'player' ? '리플레이' : '새 게임'}
            </Button>
          </div>
        </div>
      )}

      {gameOver && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <Modal
            width='550px'
            height='300px'
            backgroundColor='#ffe270'
            border='4px solid #dcb000'
          >
            <WinnerShowModal
              currentPlayer={winner!}
              winnerName={winner === 'cho' ? player1Name : player2Name}
            />
          </Modal>
        </div>
      )}
    </>
  );
}

export default App;

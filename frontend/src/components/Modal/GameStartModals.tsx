import { AnimatePresence, motion } from 'framer-motion';
import { BasicModal } from './BasicModal';
import { PlayerInputContent } from './contents/PlayerInputContent';
import { GameSelectContent } from './contents/GameSelectContent';
import { Button } from '../common/Button';
import { useGameContext } from '../../contexts/GameContext';


export const GameStartModals = () => {
  const { activeModal, toggleModal, modalVariants, isDisabled, startNewGame } = useGameContext();

  return (
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
            <BasicModal
              isOpen={true}
              footer={
                <>
                  <Button onClick={startNewGame} disabled={isDisabled}>
                    게임 시작
                  </Button>
                  <Button onClick={toggleModal}>리플레이</Button>
                </>
              }
            >
              <PlayerInputContent />
            </BasicModal>
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
            <BasicModal
              isOpen={true}
              footer={
                <Button onClick={toggleModal}>
                  새 게임
                </Button>
              }
            >
              <GameSelectContent />
            </BasicModal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

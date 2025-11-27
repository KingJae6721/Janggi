import { useState } from 'react';
import { Modal } from '../components/Modal/Modal';
import { PlayerInputContent } from '../components/Modal/contents/PlayerInputContent';
import { GameSelectContent } from '../components/Modal/contents/GameSelectContent';
import { WinnerContent } from '../components/Modal/contents/WinnerContent';
import { Button } from '../components/common/Button';
import { GameProvider } from '../contexts/GameContext';
import './ComponentPreview.css';

export const ModalPreview = () => {
  const [simpleModal, setSimpleModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [playerInputModal, setPlayerInputModal] = useState(false);
  const [gameSelectModal, setGameSelectModal] = useState(false);
  const [winnerModal, setWinnerModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);

  return (
    <GameProvider>
      <div className='preview-container'>
        <h1>Modal Component Preview</h1>

        <div className='section'>
          <h2>간편 사용 모드 (Simple Mode)</h2>
          
          <div className='button-group'>
            <Button onClick={() => setSimpleModal(true)}>
              간단한 모달
            </Button>
            <Button onClick={() => setAlertModal(true)}>
              알림 모달
            </Button>
            <Button onClick={() => setConfirmModal(true)}>
              확인 모달 (Close 버튼)
            </Button>
          </div>

          {/* 간단한 모달 */}
          <Modal isOpen={simpleModal} onClose={() => setSimpleModal(false)} title="간단한 모달">
            <p>이것은 간편 모드로 만든 모달입니다.</p>
            <p>title props만 전달하면 자동으로 Header가 생성됩니다.</p>
          </Modal>

          {/* 알림 모달 */}
          <Modal isOpen={alertModal} onClose={() => setAlertModal(false)} title="저장 완료">
            <p>데이터가 성공적으로 저장되었습니다! ✅</p>
          </Modal>

          {/* 확인 모달 */}
          <Modal 
            isOpen={confirmModal} 
            onClose={() => setConfirmModal(false)} 
            title="삭제 확인" 
            showClose
          >
            <p>정말 삭제하시겠습니까?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button onClick={() => setConfirmModal(false)}>취소</Button>
              <Button onClick={() => setConfirmModal(false)}>삭제</Button>
            </div>
          </Modal>
        </div>

        <div className='section'>
          <h2>Compound Component 모드 (Advanced Mode)</h2>
          
          <div className='button-group'>
            <Button onClick={() => setPlayerInputModal(true)}>
              플레이어 입력 모달
            </Button>
            <Button onClick={() => setGameSelectModal(true)}>
              게임 선택 모달
            </Button>
            <Button onClick={() => setWinnerModal(true)}>
              승자 모달
            </Button>
            <Button onClick={() => setCustomModal(true)}>
              커스텀 모달 (Footer 포함)
            </Button>
          </div>

          {/* 플레이어 입력 모달 */}
          <Modal isOpen={playerInputModal}>
            <Modal.Overlay onClick={() => setPlayerInputModal(false)} />
            <Modal.Content size='md'>
              <Modal.Body>
                <PlayerInputContent />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* 게임 선택 모달 */}
          <Modal isOpen={gameSelectModal}>
            <Modal.Overlay onClick={() => setGameSelectModal(false)} />
            <Modal.Content size='md'>
              <Modal.Body>
                <GameSelectContent />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* 승자 모달 */}
          <Modal isOpen={winnerModal}>
            <Modal.Overlay onClick={() => setWinnerModal(false)} />
            <Modal.Content 
              size='md'
              style={{
                backgroundColor: '#ffe270',
                border: '4px solid #dcb000',
              }}
            >
              <Modal.Body>
                <WinnerContent />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* 커스텀 모달 (Header + Footer) */}
          <Modal isOpen={customModal}>
            <Modal.Overlay onClick={() => setCustomModal(false)} />
            <Modal.Content size='lg'>
              <Modal.Header>
                <Modal.Title>설정</Modal.Title>
                <Modal.CloseButton onClick={() => setCustomModal(false)} />
              </Modal.Header>
              <Modal.Body>
                <h3>게임 설정</h3>
                <p>여기에 설정 내용이 들어갑니다.</p>
                <div style={{ marginTop: '20px' }}>
                  <label>
                    <input type="checkbox" /> 사운드 효과
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" /> 배경 음악
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" /> 애니메이션
                  </label>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setCustomModal(false)}>취소</Button>
                <Button onClick={() => setCustomModal(false)}>저장</Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </div>

        <div className='section'>
          <h2>Modal 크기 비교</h2>
          <div className='button-group'>
            <Button onClick={() => alert('Small 모달은 위의 예제들을 참고하세요')}>
              Small (sm)
            </Button>
            <Button onClick={() => alert('Medium 모달은 위의 예제들을 참고하세요')}>
              Medium (md) - 기본
            </Button>
            <Button onClick={() => alert('Large 모달은 커스텀 모달을 참고하세요')}>
              Large (lg)
            </Button>
          </div>
        </div>

        <div className='section'>
          <h2>사용 방법</h2>
          <div className='code-example'>
            <h3>간편 모드</h3>
            <pre>{`<Modal isOpen={true} title="제목" showClose>
  내용
</Modal>`}</pre>

            <h3>Compound Component 모드</h3>
            <pre>{`<Modal isOpen={true}>
  <Modal.Overlay />
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>제목</Modal.Title>
      <Modal.CloseButton />
    </Modal.Header>
    <Modal.Body>내용</Modal.Body>
    <Modal.Footer>버튼들</Modal.Footer>
  </Modal.Content>
</Modal>`}</pre>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

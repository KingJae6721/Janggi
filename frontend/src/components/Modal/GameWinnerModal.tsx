import { Button } from '../common/Button';
import { BasicModal } from './BasicModal';
import { WinnerContent } from './contents/WinnerContent';

export const GameWinnerModal = () => {
  return (
    <BasicModal
      isOpen={true}
      contentStyle={{
        backgroundColor: '#ffe270',
        border: '4px solid #dcb000',
      }}
      footer={<Button onClick={() => window.location.reload()}>재시작</Button>}
    >
      <WinnerContent />
    </BasicModal>
  );
};

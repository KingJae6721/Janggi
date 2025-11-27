import type { ReactNode, CSSProperties } from 'react';
import { Modal } from './Modal';

type BasicModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  contentStyle?: CSSProperties;
  showClose?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
};

export const BasicModal = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  size = 'md',
  contentStyle,
  showClose = false,
  initialFocus,
  restoreFocus,
}: BasicModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocus={initialFocus}
      restoreFocus={restoreFocus}
    >
      <Modal.Overlay onClick={onClose} />
      <Modal.Content size={size} style={contentStyle}>
        {(title || showClose) && (
          <Modal.Header>
            {title && <Modal.Title>{title}</Modal.Title>}
            {showClose && <Modal.CloseButton onClick={onClose} />}
          </Modal.Header>
        )}
        <Modal.Body>{children}</Modal.Body>
        {footer && <Modal.Footer>{footer}</Modal.Footer>}
      </Modal.Content>
    </Modal>
  );
};

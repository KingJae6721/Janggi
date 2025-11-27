import { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import './Modal.css';

type ModalContextType = {
  isOpen: boolean;
  onClose?: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within Modal');
  }
  return context;
};

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  // 간편 사용을 위한 옵션
  title?: string;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
  // Focus 관리 옵션
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showClose = false,
  size = 'md',
  initialFocus,
  restoreFocus = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);


  useEffect(() => {
    if (isOpen) {
      // 이전에 focus된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 모달이 열릴 때 focus 설정
      const focusModal = () => {
        if (initialFocus?.current) {
          // 사용자가 지정한 요소에 focus
          initialFocus.current.focus();
        } else if (modalRef.current) {
          // autoFocus 속성이 있는 요소 찾기
          const autoFocusElement = modalRef.current.querySelector<HTMLElement>('[autofocus]');
          if (autoFocusElement) {
            autoFocusElement.focus();
            return;
          }

          // 첫 번째 focusable 요소에 focus
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      };

      // 약간의 지연을 두고 focus (DOM 렌더링 완료 후)
      setTimeout(focusModal, 0);
    }

    return () => {
      // 모달이 닫힐 때 이전 focus 복원
      if (!isOpen && restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, initialFocus, restoreFocus]);

  // Focus Trap (Tab 키로 모달 내부에서만 순환
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: 첫 번째 요소에서 마지막으로
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: 마지막 요소에서 첫 번째로
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // ESC 키로 닫기 & 스크롤 방지
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const value = { isOpen, onClose };

  // 간편 사용 모드
  if (title !== undefined || showClose) {
    return (
      <ModalContext.Provider value={value}>
        <div className='modal-wrapper' ref={modalRef}>
          <Overlay />
          <Content size={size}>
            {(title || showClose) && (
              <Header>
                {title && <Title>{title}</Title>}
                {showClose && <CloseButton />}
              </Header>
            )}
            <Body>{children}</Body>
          </Content>
        </div>
      </ModalContext.Provider>
    );
  }

  // Compound Component 모드
  return (
    <ModalContext.Provider value={value}>
      <div className='modal-wrapper' ref={modalRef}>{children}</div>
    </ModalContext.Provider>
  );
};

// ===== Overlay =====
type OverlayProps = {
  onClick?: () => void;
};

const Overlay = ({ onClick }: OverlayProps = {}) => {
  const { onClose } = useModalContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onClose) {
      onClose();
    }
  };

  return <div className='modal-overlay' onClick={handleClick} />;
};

// ===== Content =====
type ContentProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
};

const Content = ({ children, size = 'md', style }: ContentProps) => {
  return (
    <div className={`modal-content modal-content--${size}`} style={style}>
      {children}
    </div>
  );
};


type HeaderProps = {
  children: ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return <div className='modal-header'>{children}</div>;
};

type TitleProps = {
  children: ReactNode;
};

const Title = ({ children }: TitleProps) => {
  return <h2 className='modal-title'>{children}</h2>;
};

type CloseButtonProps = {
  onClick?: () => void;
};

const CloseButton = ({ onClick }: CloseButtonProps = {}) => {
  const { onClose } = useModalContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <button className='modal-close-button' onClick={handleClick} aria-label='Close'>
      ✕
    </button>
  );
};


type BodyProps = {
  children: ReactNode;
};

const Body = ({ children }: BodyProps) => {
  return <div className='modal-body'>{children}</div>;
};

type FooterProps = {
  children: ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return <div className='modal-footer'>{children}</div>;
};

// Compound Components 연결
Modal.Overlay = Overlay;
Modal.Content = Content;
Modal.Header = Header;
Modal.Title = Title;
Modal.CloseButton = CloseButton;
Modal.Body = Body;
Modal.Footer = Footer;

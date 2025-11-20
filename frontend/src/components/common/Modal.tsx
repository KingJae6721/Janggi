import './Modal.css';

type ModalProps = {
  children: React.ReactNode;
  width?: string;
  height?: string;
  backgroundColor?: string;
};

export const Modal = ({
  children,
  width = '400px',
  height = '300px',
  backgroundColor = '#ffffff',
}: ModalProps) => {
  return (
    <div
      className='modal-container'
      style={
        {
          width,
          height,
          backgroundColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

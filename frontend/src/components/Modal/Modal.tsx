import './Modal.css';

type ModalProps = {
  children: React.ReactNode;
  width?: string;
  height?: string;
  backgroundColor?: string;
  border?: string;
};

export const Modal = ({
  children,
  width = '550px',
  height = '500px',
  backgroundColor = '#ffffff',
  border = '2px solid #8b4513',
}: ModalProps) => {
  return (
    <div
      className='modal-container'
      style={
        {
          width,
          height,
          backgroundColor,
          border,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

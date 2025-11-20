import './Button.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <div className='button-container'>
      <button className='button' onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </div>
  );
};

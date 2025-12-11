import './Button.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // 추가
};

export const Button = ({
  children,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) => {
  return (
    <div className='button-container'>
      <button
        type='button'
        className={`button ${className}`} // 기본 button + 추가 className
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

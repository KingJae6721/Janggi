import './Button.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <div className='button-container'>
      <button className='button' onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

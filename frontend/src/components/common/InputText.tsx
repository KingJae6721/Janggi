import React from 'react';
import './InputText.css';

type InputTextProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  borderColor?: string;
  onEnter?: () => void;
  autoFocus?: boolean;
};

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ placeholder, value, onChange, borderColor, onEnter, autoFocus }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 한글 입력 중(조합 중)일 때는 Enter 무시
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.key === 'Enter' && onEnter) {
        // e.preventDefault();
        onEnter();
      }
    };

    return (
      <input
        ref={ref}
        type='text'
        placeholder={placeholder}
        className='input-label'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        style={borderColor ? { borderColor } : undefined}
        autoFocus={autoFocus}
      />
    );
  }
);

InputText.displayName = 'InputText';

export default InputText;

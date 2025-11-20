import React from 'react';
import './InputText.css';

type InputTextProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  borderColor?: string;
};

const InputText = ({
  placeholder,
  value,
  onChange,
  borderColor,
}: InputTextProps) => {
  return (
    <input
      type='text'
      placeholder={placeholder}
      className='input-label'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={borderColor ? { borderColor } : undefined}
    />
  );
};

export default InputText;

import React, { useState, useEffect } from 'react';

interface InputFieldProps {
  label?: string;
  type: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  characterLimit?: number;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  className = '',
  onChange,
  characterLimit = 0,
  error,
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [charCount, setCharCount] = useState(value ? value.length : 0);

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
      setCharCount(value.length);
    }
  }, [value, internalValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.length <= characterLimit) {
      setInternalValue(newValue);
      setCharCount(newValue.length);
      if (onChange) onChange(e);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="mb-2 text-sm font-medium text-neutral-900 block">{label}</label>}
      <div
        className={`w-full relative rounded-[20px] border border-solid ${error ? 'border-red-500' : 'border-[#E9EAF0] border-opacity-30'} border-[#E9EAF0] border-opacity-30 h-[52px] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.25)] focus-within:shadow-[0px_4px_10px_rgba(0,0,0,0.25)]`}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={characterLimit > 0 ? handleInputChange : onChange}
          className="px-4 py-0 text-sm border-[none] size-full text-zinc-600 rounded-[20px]"
        />

        {characterLimit > 0 && (
          <span className="absolute text-sm tracking-normal leading-6 text-gray-600 right-[18px] top-[13px]">
            {charCount}/{characterLimit}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;

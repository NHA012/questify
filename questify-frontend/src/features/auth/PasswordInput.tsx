'use client';

import React, { useState, ChangeEvent } from 'react';
import EyeIcon from './signup/EyeIcon';

interface PasswordInputProps {
  placeholder: string;
  className?: string;
  label: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  className = '',
  label,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col gap-1.5 flex-1 ${className}`}>
      <label className="mb-2 text-sm font-medium text-neutral-900 block">{label}</label>
      <div
        className={`w-full rounded-xl border border-solid ${error ? 'border-red-500' : 'border-[#E9EAF0] border-opacity-30'} h-[52px] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.25)] focus-within:shadow-[0px_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-between`}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`px-4 py-0 text-sm border-[none] size-full text-zinc-600 rounded-xl w-[90%]`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="mr-1 cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;

import React from 'react';
import GoogleIcon from './GoogleIcon';

interface GoogleSignInButtonProps {
  className?: string;
  onClick?: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ className = '', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex gap-2 justify-center items-center text-sm text-black rounded-xl border border-solid cursor-pointer border-black border-opacity-30 h-[41px] shadow-[0px_4px_10px_rgba(0,0,0,0.25)] w-full max-sm:h-[45px] ${className}`}
    >
      <GoogleIcon />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignInButton;

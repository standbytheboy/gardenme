import React from 'react';
import { ButtonProps } from './interfaces';

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="
        flex justify-center items-center w-32 text-[#386641] bg-[#F2E8CF]
        rounded-full h-8 hover:opacity-80 hover:border-none cursor-pointer
      "
      onClick={onClick}
    >
      {children}
    </button>
  );
};
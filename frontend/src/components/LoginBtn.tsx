import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

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
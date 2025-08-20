import React from 'react';
import { ArrowRight } from 'akar-icons';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ActionBtn: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="
        group flex justify-center items-center text-[#386641] bg-[#F2E8CF]
        rounded-full hover:opacity-90 hover:border-none p-[5px] pl-[2rem] cursor-pointer
      "
      onClick={onClick}
    >
      {children}
      <div className="
        flex justify-center items-center bg-[#386641] w-[55px] h-[55px] rounded-full ml-[1rem]
        transition-transform duration-300 ease-in-out
        group-hover:-rotate-45
      ">
        <ArrowRight strokeWidth={2} size={25} color='#F2E8CF'/>
      </div>
    </button>
  );
};
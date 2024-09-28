"use client";
import React from "react";

interface ButtonProps {
  color: "white" | "black";
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ color, onClick, children }) => {
  const buttonStyles = {
    white: "bg-white text-black border-black hover:bg-gray-200",
    black: "bg-black text-white border-white hover:bg-gray-700",
  };

  const appliedStyle = buttonStyles[color] || buttonStyles.white;

  return (
    <button className={`py-3 px-6 border ${appliedStyle}`} onClick={onClick}>
      {children}
    </button>
  );
};

"use client";
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="btn-primary" onClick={onClick}>
      {children}
    </button>
  );
};

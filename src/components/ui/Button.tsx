"use client";
import React from "react";
import clsx from "clsx"; // Opcjonalnie: możesz użyć clsx do lepszego zarządzania klasami

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      className={clsx("btn-primary", className)} // Użycie clsx do łączenia klas
      onClick={onClick}
    >
      {children}
    </button>
  );
};

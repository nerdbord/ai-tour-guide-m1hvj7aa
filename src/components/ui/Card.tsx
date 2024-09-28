"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface CardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ title, isSelected, onClick }) => {
  return (
    <div
      className={`relative border p-4 rounded second-bg h-32 cursor-pointer `}
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {isSelected && (
        <div className="absolute top-2 right-2 ">
          <FaCheckCircle size={24} />
        </div>
      )}
    </div>
  );
};

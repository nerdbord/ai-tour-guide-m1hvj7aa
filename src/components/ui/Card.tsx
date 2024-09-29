"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface CardProps {
  isSelected: boolean;
  onClick: () => void;
  src: string;
}

export const Card: React.FC<CardProps> = ({ isSelected, onClick, src }) => {
  return (
    <div
      className={`relative border  rounded second-bg h-32 cursor-pointer `}
      onClick={onClick}
    >
      <img
        src={src}
        alt="material image"
        className="w-full h-full object-cover rounded"
      />
      {isSelected && (
        <div className="absolute top-2 right-2">
          <FaCheckCircle size={24} />
        </div>
      )}
    </div>
  );
};

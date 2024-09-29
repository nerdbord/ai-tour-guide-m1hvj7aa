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
      className={`relative border p-4 rounded second-bg h-32 cursor-pointer `}
      onClick={onClick}
    >
      {/* <h2 className="text-lg font-semibold">{title}</h2> */}
      <img src={src} alt="material image" />
      {isSelected && (
        <div className="absolute top-2 right-2 ">
          <FaCheckCircle size={24} />
        </div>
      )}
    </div>
  );
};

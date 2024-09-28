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
      className={`relative border p-4 bg-white h-32 cursor-pointer ${
        isSelected ? "border-green-500" : ""
      }`}
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {isSelected && (
        <div className="absolute top-2 right-2 text-green-500">
          <FaCheckCircle size={24} />
        </div>
      )}
    </div>
  );
};

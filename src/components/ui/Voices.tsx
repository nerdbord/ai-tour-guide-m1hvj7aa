"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface VoiceProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Voices: React.FC<VoiceProps> = ({ name, isSelected, onClick }) => {
  return (
    <div
      className="relative border p-4 rounded second-bg h-32 cursor-pointer" // Usunięty nadmiarowy nawias
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold">{name}</h2>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <FaCheckCircle size={24} />
        </div>
      )}
    </div>
  );
};

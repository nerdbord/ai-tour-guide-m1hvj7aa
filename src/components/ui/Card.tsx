"use client";
import React from "react";

interface CardProps {
  title: string;
}

export const Card: React.FC<CardProps> = ({ title }) => {
  return (
    <div className="border p-4 bg-white h-32">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

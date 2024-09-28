"use client";
import React from "react";
import { HiMinus } from "react-icons/hi";

interface ListItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onRemove?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  imageUrl,
  onRemove,
}) => {
  return (
    <div className="border rounded p-2 flex items-center gap-4 second-bg shadow-sm mb-1 cursor-pointer">
      {imageUrl && (
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded "
          />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm ">{description}</p>}
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="w-6 h-6 border  text-white rounded-full flex items-center justify-center"
        >
          <HiMinus size={16} />
        </button>
      )}
    </div>
  );
};

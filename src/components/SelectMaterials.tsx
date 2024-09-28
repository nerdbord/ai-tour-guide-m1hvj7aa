"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import Link from "next/link";
import { SlCamera } from "react-icons/sl";

interface Material {
  id: number;
  title: string;
}

interface SelectMaterialsProps {
  onSelectedMaterialsChange: (materials: Material[]) => void;
  closeSelectMaterials: () => void;
}

export const SelectMaterials: React.FC<SelectMaterialsProps> = ({
  onSelectedMaterialsChange,
  closeSelectMaterials,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const cardsData: Material[] = [
    { id: 1, title: "Card 1" },
    { id: 2, title: "Card 2" },
    { id: 3, title: "Card 3" },
    { id: 4, title: "Card 4" },
    { id: 5, title: "Card 5" },
    { id: 6, title: "Card 6" },
    { id: 7, title: "Card 7" },
    { id: 8, title: "Card 8" },
    { id: 9, title: "Card 9" },
    { id: 10, title: "Card 10" },
  ];

  const handleCardClick = (card: Material) => {
    setSelectedMaterials((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === card.id);

      if (isSelected) {
        return prevSelected.filter((material) => material.id !== card.id);
      } else {
        return [...prevSelected, card];
      }
    });
  };

  useEffect(() => {
    onSelectedMaterialsChange(selectedMaterials);
  }, [selectedMaterials, onSelectedMaterialsChange]);

  const handleAddSelected = () => {
    onSelectedMaterialsChange(selectedMaterials);
    closeSelectMaterials();
  };

  return (
    <div className="z-10 main-bg w-full absolute pt-6 pb-12 px-4 left-0 bottom-0 right-0 top-0">
      <div className="pb-11 flex justify-between items-start">
        <div>
          <p className="text-lg not-italic font-medium leading-6 pb-2">
            Wybierz zdjęcia
          </p>
          <p className="text-sm not-italic font-semibold">
            Dałeś/aś dostęp aplikacji do <br /> wybranej liczby zdjęć
          </p>
        </div>
        <Link className="second-bg py-1 px-3 rounded-full" href="/about">
          Zarządzaj
        </Link>
      </div>

      {/* Grid z kartami */}
      <div className="grid grid-cols-2 gap-1 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
        <Link
          className="relative border p-4 rounded second-bg h-32 cursor-pointer flex items-center justify-center"
          href={"/capture"}
        >
          <SlCamera className="h-[60px] w-[60px]" />
        </Link>
        {cardsData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            isSelected={selectedMaterials.some((item) => item.id === card.id)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 pt-9">
        <Button onClick={handleAddSelected}>Dodaj wybrane</Button>
      </div>
    </div>
  );
};

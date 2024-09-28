"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface Material {
  id: number;
  title: string;
}

interface SelectMaterialsProps {
  onSelectedMaterialsChange: (materials: Material[]) => void; // Prop do przekazania wybranych materiałów do MainPage
  closeSelectMaterials: () => void; // Prop do zamknięcia SelectMaterials
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
    { id: 11, title: "Card 11" },
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
    onSelectedMaterialsChange(selectedMaterials); // Wywołaj prop za każdym razem, gdy selectedMaterials się zmieni
  }, [selectedMaterials, onSelectedMaterialsChange]);

  const handleAddSelected = () => {
    onSelectedMaterialsChange(selectedMaterials); // Przekazujemy wybrane materiały do rodzica
    closeSelectMaterials(); // Zamykamy okno
  };

  return (
    <div className="z-10 bg-slate-500 w-full absolute pt-6 pb-12 px-4 left-0 bottom-0 right-0">
      <p className="text-lg not-italic font-medium leading-6 pb-4">
        Wybierz materiały
      </p>
      {/* Grid z kartami */}
      <div className="grid grid-cols-2 gap-4 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            isSelected={selectedMaterials.some((item) => item.id === card.id)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      <div className="flex gap-3 pt-4">
        <Button color="white">Zrób zdjęcie</Button>
        <Button color="black" onClick={handleAddSelected}>
          Dodaj wybrane
        </Button>
      </div>
    </div>
  );
};

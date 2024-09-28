"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface Material {
  id: number;
  title: string;
}

export const SelectMaterials = () => {
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
      // Sprawdzamy, czy karta już istnieje w wybranych materiałach
      const isSelected = prevSelected.some((item) => item.id === card.id);

      if (isSelected) {
        // Jeśli karta już jest wybrana, usuwamy ją
        return prevSelected.filter((material) => material.id !== card.id);
      } else {
        // Jeśli karty nie ma w wybranych, dodajemy ją
        return [...prevSelected, card];
      }
    });
  };

  useEffect(() => {
    console.log(selectedMaterials); // Tutaj zobaczysz zaktualizowaną wartość
  }, [selectedMaterials]);

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
        <Button color="black">Dodaj wybrane</Button>
      </div>
    </div>
  );
};

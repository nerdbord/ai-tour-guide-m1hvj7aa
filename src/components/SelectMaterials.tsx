"use client";
import React from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export const SelectMaterials = () => {

  const cardsData = [
    { id: 1, title: "Card 1" },
    { id: 2, title: "Card 2" },
    { id: 3, title: "Card 3" },
    { id: 4, title: "Card 4" },
    { id: 5, title: "Card 5" },
    { id: 6, title: "Card 6" },
  ];

  return (
    <div className="z-10 bg-slate-500 w-full absolute pt-6 pb-12 px-4 left-0 bottom-0 right-0">
      <p className="text-lg not-italic font-medium leading-6 pb-10">
        Wybierz materiały
      </p>

      <div className="grid grid-cols-2 gap-4 pb-10">
        {cardsData.map((card) => (
          <Card key={card.id} title={card.title} />
        ))}
      </div>
      <div className="flex gap-3 pt-10">
        <Button color="white">Zrób zdjęcie</Button>
        <Button color="black">Dodaj wybrane</Button>
      </div>
    </div>
  );
};

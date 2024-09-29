"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import Link from "next/link";
import { SlCamera } from "react-icons/sl";

// interface Material {
//   id: number;
//   title: string;
//   src: string
// }

interface SelectMaterialsProps {
  onSelectedMaterialsChange: (materials: ImageFile[]) => void;
  closeSelectMaterials: () => void;
}

interface ImageFile {
  image: string; // Base64 string
  name: string;  // File name
}

export const SelectMaterials: React.FC<SelectMaterialsProps> = ({
  onSelectedMaterialsChange,
  closeSelectMaterials,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<ImageFile[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);

  // const cardsData: Material[] = [
  //   { id: 1, title: "Card 1" },
  //   { id: 2, title: "Card 2" },
  //   { id: 3, title: "Card 3" },
  //   { id: 4, title: "Card 4" },
  //   { id: 5, title: "Card 5" },
  //   { id: 6, title: "Card 6" },
  //   { id: 7, title: "Card 7" },
  //   { id: 8, title: "Card 8" },
  //   { id: 9, title: "Card 9" },
  //   { id: 10, title: "Card 10" },
  // ];

  const handleCardClick = (card: ImageFile) => {
    setSelectedMaterials(prevSelected => {
      const isSelected = prevSelected.some(item => item.name === card.name);

      if (isSelected) {
        return prevSelected.filter(material => material.name !== card.name);
      } else {
        return [...prevSelected, card];
      }
    });
  };

  // useEffect(() => {
  //   onSelectedMaterialsChange(selectedMaterials);
  // }, [selectedMaterials, onSelectedMaterialsChange]);

  const handleAddSelected = () => {
    onSelectedMaterialsChange(selectedMaterials);
    closeSelectMaterials();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = files.filter((file) => file.type.startsWith('image/')); // Filtruj tylko obrazy
    
    const readFiles = imageFiles.map((file) => {
      return new Promise<ImageFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve({ image: reader.result as string, name: file.name }); // Zapisz obraz jako Base64 string i nazwę
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Konwersja na Base64
      });
    });

    Promise.all(readFiles).then((imagesData) => {
      setImages(imagesData); // Zapisz tablicę z obiektami zawierającymi image (Base64 string) i name
    });
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
        <label className="second-bg py-1 px-3 rounded-full cursor-pointer">
          Zarządzaj
          <input
            multiple
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {/* <Link className="second-bg py-1 px-3 rounded-full" href="/about">
          Zarządzaj
        </Link> */}
      </div>

      {/* Grid z kartami */}
      <div className="grid grid-cols-2 gap-1 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
        <Link
          className="relative border p-4 rounded second-bg h-32 cursor-pointer flex items-center justify-center"
          href={"/capture"}
        >
          <SlCamera className="h-[60px] w-[60px]" />
        </Link>
        {images.map((card, idx) => (
          <Card
            key={idx}
            // title={card.title}
            src={card.image}
            isSelected={selectedMaterials.some(item => item.name === card.name)}
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

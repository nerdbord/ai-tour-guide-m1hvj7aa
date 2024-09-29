"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface SelectMaterialsProps {
  onSelectedMaterialsChange: (materials: ImageFile[]) => void;
  closeSelectMaterials: () => void;
}

interface ImageFile {
  image: string; // Base64 string
  name: string; // File name
}

export const SelectMaterials: React.FC<SelectMaterialsProps> = ({
  onSelectedMaterialsChange,
  closeSelectMaterials,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<ImageFile[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // Stan dla przetwarzania zdjęć
  const [hasSeenInitialScreen, setHasSeenInitialScreen] = useState(false); // Stan kontrolujący wyświetlanie ekranu początkowego
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "")); // Animacja kropek
    }, 500);

    return () => clearInterval(interval); // Czyszczenie interwału po demontażu komponentu
  }, []);

  const handleCardClick = (card: ImageFile) => {
    setSelectedMaterials((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.name === card.name);

      if (isSelected) {
        return prevSelected.filter((material) => material.name !== card.name);
      } else {
        return [...prevSelected, card];
      }
    });
  };

  const handleAddSelected = async () => {
    setIsProcessing(true); // Rozpocznij przetwarzanie
    setHasSeenInitialScreen(true); // Ustaw, że użytkownik zobaczył ekran początkowy

    try {
      // Czekaj na wywołanie funkcji przetwarzania
      await onSelectedMaterialsChange(selectedMaterials);
    } finally {
      setIsProcessing(false); // Zakończ przetwarzanie po zakończeniu operacji
      closeSelectMaterials();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = files.filter((file) => file.type.startsWith("image/")); // Filtruj tylko obrazy

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
      setImages((prevImages) => [...prevImages, ...imagesData]); // Dodaj nowe obrazy do już istniejących
    });
  };

  // Jeśli trwa przetwarzanie, pokaż komunikat o analizowaniu
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center pt-4 absolute bottom-0 top-0 left-0 right-0 main-bg">
        <p className="text-sm not-italic font-medium ">
          Analizuję przesłane zdjęcia
          {/* Animacja kropek */}
          <span
            style={{ display: "inline-block", width: "1em", textAlign: "left" }}
          >
            {dots}
          </span>
        </p>
      </div>
    );
  }

  // Jeśli użytkownik już zobaczył ekran początkowy, nie pokazuj go ponownie
  if (hasSeenInitialScreen) {
    return (
      <div className="z-10 main-bg w-full absolute pt-6 pb-12 px-4 left-0 bottom-0 right-0 top-0">
        <div className="grid grid-cols-2 gap-1 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
          {images.map((card, idx) => (
            <Card
              key={idx}
              src={card.image}
              isSelected={selectedMaterials.some(
                (item) => item.name === card.name
              )}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 pt-9">
          <label className="btn-primary cursor-pointer w-full">
            Dodaj i wybierz zdjęcia
            <input
              multiple
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Przycisk "Załaduj" pojawia się, gdy są wybrane materiały */}
        {images.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              onClick={handleAddSelected}
              className="btn-secondary w-full"
            >
              Załaduj wybrane
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Początkowy ekran, który pokazujemy tylko raz
  return (
    <div className="z-10 main-bg w-full absolute pt-6 pb-12 px-4 left-0 bottom-0 right-0 top-0">
      <div className="pb-11 flex justify-between items-start">
        <div>
          <h1 className="text-3xl not-italic font-medium leading-6 pb-2 mt-10">
            Wybierz zdjęcia
          </h1>
          <p className="text-sm not-italic font-semibold py-4">
            Dałeś/aś dostęp aplikacji do <br /> wybranej liczby zdjęć
          </p>
        </div>
      </div>

      {/* Grid z kartami */}
      <div className="grid grid-cols-2 gap-1 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
        {images.map((card, idx) => (
          <Card
            key={idx}
            src={card.image}
            isSelected={selectedMaterials.some(
              (item) => item.name === card.name
            )}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 pt-9">
        <label className="btn-primary cursor-pointer w-full">
          Dodaj i wybierz zdjęcia
          <input
            multiple
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Przycisk "Załaduj" pojawia się, gdy są wybrane materiały */}
      {images.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button onClick={handleAddSelected} className="btn-secondary w-full">
            Załaduj wybrane
          </Button>
        </div>
      )}
    </div>
  );
};

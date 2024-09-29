/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";
import { generateTextFromImage } from "@/app/_actions/generateTextFromImage";
import { StoryPage } from "@/components/StoryPage";
import { Garnek2 } from "./ui/Garnek2";

interface ImageFile {
  image: string; // Base64 string
  name: string; // File name
}

export const MainPage = () => {
  const [selectVisible, setSelectVisible] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    extractedText: string;
    keyConcepts: string[];
  } | null>(null);

  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state

  const handleSelectVisible = () => {
    setSelectVisible(!selectVisible);
  };

  const handleSelectedMaterials = async (newMaterials: ImageFile[]) => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state

      // Optional: Resize or compress images here if necessary
      // Example: const resizedImages = await resizeImages(newMaterials);

      const text = await generateTextFromImage(
        newMaterials.map((material) => material.image),
      );

      setExtractedData(text);
      setSelectVisible(false);
      setShowInitialMessage(false);
    } catch (err) {
      console.error("Error generating text from image:", err);
      setError("Nie udało się przetworzyć obrazu. Proszę spróbować ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-between h-full w-full ">
      {/* Initial Screen Displayed Only Once */}
      {showInitialMessage && (
        <div>
          <h1 className="text-3xl font-bold mt-10">
            Czego chcesz się nauczyć?
          </h1>
          <p className="text-lg not-italic font-medium leading-6 py-4">
            Wrzuć materiał, z którego mam <br /> stworzyć historię:
          </p>
        </div>
      )}

      {/* Display error message if any */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center mb-4">
          <p>Przetwarzanie obrazu...</p>
        </div>
      )}

      {/* Display StoryPage or Upload Interface */}
      {extractedData ? (
        <StoryPage {...extractedData} />
      ) : (
        <div className="w-full h-full border border-dashed flex flex-col items-center justify-end gap-3 mt-10 pt-7 pb-6 px-12 flex-grow second-bg">
          <Garnek2 />
          <p className="text-center text-sm not-italic font-semibold leading-4 mt-6">
            Wrzuć zdjęcia lub tekst, <br /> z których chcesz się uczyć
          </p>
          <Button onClick={handleSelectVisible}>Wrzuć zdjęcia</Button>
        </div>
      )}

      {/* SelectMaterials Modal */}
      {selectVisible && (
        <SelectMaterials
          onSelectedMaterialsChange={handleSelectedMaterials}
          closeSelectMaterials={() => setSelectVisible(false)}
        />
      )}
    </div>
  );
};

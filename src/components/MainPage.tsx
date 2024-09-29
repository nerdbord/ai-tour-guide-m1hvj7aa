/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";
import { HiPlus } from "react-icons/hi2";
import { generateTextFromImage } from "@/app/_actions/generateTextFromImage";
import { StoryPage } from "@/components/StoryPage";
import { Garnek } from "./ui/Garnek";

interface Material {
  id: number;
  title: string;
}

type Props = {};

interface ImageFile {
  image: string; // Base64 string
  name: string; // File name
}

export const MainPage = (props: Props) => {
  const [selectVisible, setSelectVisible] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    extractedText: string;
    keyConcepts: string[];
  } | null>(null);

  const handleSelectVisible = () => {
    setSelectVisible(!selectVisible);
  };

  const handleSelectedMaterials = async (newMaterials: ImageFile[]) => {
    // Od razu po wybraniu zdjęć wywołujemy generowanie historii
    const text = await generateTextFromImage(
      newMaterials.map((material) => material.image)
    );

    setExtractedData(text);
    setSelectVisible(false);
  };

  return (
    <div className="flex flex-col space-between h-full w-full ">
      <div>
        <h1 className={`text-3xl not-italic font-bold mt-10`}>
          Czego chcesz się nauczyć?
        </h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Wrzuć materiał, z którego mam <br /> stworzyć historię:
        </p>
      </div>

      {extractedData ? (
        <StoryPage {...extractedData} />
      ) : (
        <div className="w-full h-full border border-dashed flex flex-col items-center justify-end gap-3 mt-10 pt-7 pb-6 px-12 flex-grow second-bg">
          <Garnek />
          <p className="text-center text-sm not-italic font-semibold leading-4 mt-6">
            Wrzuć zdjęcia lub tekst, <br /> z których chcesz się uczyć
          </p>
          <Button onClick={handleSelectVisible}>Wrzuć zdjęcia</Button>
        </div>
      )}

      {selectVisible && (
        <SelectMaterials
          onSelectedMaterialsChange={handleSelectedMaterials}
          closeSelectMaterials={() => setSelectVisible(false)}
        />
      )}
    </div>
  );
};

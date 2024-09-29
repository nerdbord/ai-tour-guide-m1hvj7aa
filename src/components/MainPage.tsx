/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";
import { HiPlus } from "react-icons/hi2";
import { ListItem } from "./ui/ListItem";
import { generateTextFromImage } from "@/app/_actions/generateTextFromImage";
import { StoryPage } from "@/components/StoryPage";

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
  const [selectedMaterials, setSelectedMaterials] = useState<ImageFile[]>([]);
  const [extractedData, setExtractedData] = useState<{
    extractedText: string;
    keyConcepts: string[];
  } | null>(null);

  const handleSelectVisible = () => {
    setSelectVisible(!selectVisible);
  };

  const handleSelectedMaterials = (newMaterials: ImageFile[]) => {
    setSelectedMaterials(prevMaterials => {
      // Create a set of all current and new materials by their IDs
      const materialSet = new Map<string, ImageFile>();
      prevMaterials.forEach(material =>
        materialSet.set(material.name, material),
      );
      newMaterials.forEach(material =>
        materialSet.set(material.name, material),
      );

      // Convert the map back to an array
      return Array.from(materialSet.values());
    });
  };

  const handleRemoveMaterial = (name: string) => {
    setSelectedMaterials(prevMaterials =>
      prevMaterials.filter(material => material.name !== name),
    );
  };

  const handleConvert = async () => {
    const text = await generateTextFromImage(
      selectedMaterials.map(material => material.image),
    );

    setExtractedData(text);
    setSelectVisible(false);
    setSelectedMaterials([]);

    console.log(text);
  };

  return (
    <div className="flex flex-col space-between items-center h-full w-full ">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">
          Czego chcesz się nauczyć?
        </h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Wrzuć materiał, z którego mam <br /> stworzyć historię:
        </p>
      </div>

      {selectedMaterials.length > 0 && !extractedData ? (
        <div className="flex flex-col max-h-full w-full flex-grow mt-4  mb-9 gap-4">
          <div className="flex justify-between items-center">
            Wybrane materiały ({selectedMaterials.length})
            <div
              className="second-bg py-1 px-3 rounded-full cursor-pointer flex items-center gap-2"
              onClick={handleSelectVisible}
            >
              <HiPlus className="text-white" /> <p>Dodaj więcej</p>
            </div>
          </div>
          <div className="overflow-y-scroll max-h-96 scrollbar-hide">
            {selectedMaterials.map(material => (
              <ListItem
                key={material.name}
                title={material.name}
                onRemove={() => handleRemoveMaterial(material.name)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 pt-9">
            <Button onClick={handleConvert}>Załaduj</Button>
          </div>
        </div>
      ) : extractedData ? (
        <StoryPage {...extractedData} />
      ) : (
        <div className="w-full h-full border border-dashed flex flex-col items-center justify-end gap-3 mt-[74px] pt-7 pb-6 px-12 flex-grow second-bg ">
          <p className="text-center text-sm not-italic font-semibold leading-4">
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

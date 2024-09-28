/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";
import { HiPlus } from "react-icons/hi2";
import { ListItem } from "./ui/ListItem";

interface Material {
  id: number;
  title: string;
}

type Props = {};

export const MainPage = (props: Props) => {
  const [selectVisible, setSelectVisible] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const handleSelectVisible = () => {
    setSelectVisible(!selectVisible);
  };

  const handleSelectedMaterials = (newMaterials: Material[]) => {
    setSelectedMaterials((prevMaterials) => {
      // Create a set of all current and new materials by their IDs
      const materialSet = new Map<number, Material>();
      prevMaterials.forEach((material) =>
        materialSet.set(material.id, material)
      );
      newMaterials.forEach((material) =>
        materialSet.set(material.id, material)
      );

      // Convert the map back to an array
      return Array.from(materialSet.values());
    });
  };

  const handleRemoveMaterial = (id: number) => {
    setSelectedMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== id)
    );
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

      {selectedMaterials.length > 0 ? (
        <div className="flex flex-col w-full flex-grow mt-4 mb-9 gap-4">
          <div className="flex justify-between items-center">
            Wybrane materiały ({selectedMaterials.length})
            <div
              className="second-bg py-1 px-3 rounded-full cursor-pointer flex items-center gap-2"
              onClick={handleSelectVisible}
            >
              <HiPlus className="text-white" /> <p>Dodaj więcej</p>
            </div>
          </div>
          <div className="overflow-y-scroll max-h-[300px] h-[200px] scrollbar-hide rounded-lg p-2">
            {selectedMaterials.map((material) => (
              <ListItem
                key={material.id}
                title={material.title}
                onRemove={() => handleRemoveMaterial(material.id)}
              />
            ))}
          </div>
          <Button
            className="mt-4 w-auto"
            onClick={() => setSelectVisible(false)}
          >
            Zaczynamy!
          </Button>
        </div>
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

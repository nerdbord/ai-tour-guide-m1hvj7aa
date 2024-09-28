/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";
import { Selected } from "./Selected"; // Import komponentu Selected

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

  const handleSelectedMaterials = (materials: Material[]) => {
    setSelectedMaterials(materials);
    console.log(materials);
  };

  return (
    <>
      <div className="w-full">
        <Button color="white">Moje historie</Button>
      </div>

      {selectedMaterials.length > 0 ? (
        <Selected />
      ) : (
        <>
          <h1 className="text-3xl not-italic font-bold mt-20">
            Czego chcesz się nauczyć?
          </h1>
          <p className="text-lg not-italic font-medium leading-6 mt-[26px]">
            Wrzuć materiał, z którego mam <br /> stworzyć historię:
          </p>
          <div className="w-full h-40 border border-dashed flex flex-col items-center justify-center gap-6 mt-[26px] pt-7 pb-6 px-12">
            <p className="text-center text-sm not-italic font-semibold leading-4">
              Umieść obrazy materiałów, których chciałbyś się nauczyć.
            </p>
            <Button color="black" onClick={handleSelectVisible}>
              Wrzuć zdjęcia
            </Button>
          </div>
        </>
      )}

      {/* Wyświetlanie SelectMaterials, gdy selectVisible jest true */}
      {selectVisible && (
        <SelectMaterials
          onSelectedMaterialsChange={handleSelectedMaterials}
          closeSelectMaterials={() => setSelectVisible(false)}
        />
      )}
    </>
  );
};

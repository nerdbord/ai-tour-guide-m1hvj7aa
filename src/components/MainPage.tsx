/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Button } from "./ui/Button";
import { SelectMaterials } from "./SelectMaterials";

type Props = {};

export const MainPage = (props: Props) => {
  return (
    <>
      <div className="w-full">
        <Button color="white">Moje historie</Button>
      </div>

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
        <Button color="black">Wrzuć zdjęcia</Button>
      </div>
      <SelectMaterials />
    </>
  );
};

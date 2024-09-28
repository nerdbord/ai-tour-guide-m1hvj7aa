/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Button } from "./ui/Button";

type Props = {};

export const LoadingScreen = (props: Props) => {
  return (
    <div className="flex flex-col justify-between items-center w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">Przygotuj się</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Już za chwilę wybierzesz <br /> swoją postać
        </p>
      </div>

      <div className="flex items-center justify-end w-full mt-4">
        <div className="second-bg py-1 px-3 rounded-full cursor-pointer flex items-center gap-2 ml-auto">
          Edytuj / Dodaj więcej
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full">
        <p className="text-center">TUTAJ WYGENEROWANY TYTUL I PODROZDZIAŁY</p>
      </div>

      <div className="mb-4">
        <Button>Stwórz historie</Button>
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Garnek } from "./ui/Garnek";

type Props = {};

export const LoadingScreen = (props: Props) => {
  return (
    <div className="flex flex-col justify-between  w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">Przygotuj się</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Już za chwilę wybierzesz <br /> swoją postać
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <Garnek />
        <p className="text-center mt-4">Gotujemy dla ciebie opowieść...</p>
      </div>
    </div>
  );
};

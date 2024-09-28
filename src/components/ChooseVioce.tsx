/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Button } from "./ui/Button";

type Props = {};

export const ChooseVoice = (props: Props) => {
  return (
    <div className="flex flex-col justify-between  w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">Wybierz głos</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Tym głosem będzie czytana <br />
          twoja opowieść
        </p>
      </div>

      <div className="flex-grow flex items-center justify-center w-full">
        <p className="text-center">Gotujemy dla ciebie opowieść...</p>
      </div>
    </div>
  );
};

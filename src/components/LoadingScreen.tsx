/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Garnek } from "./ui/Garnek";

type Props = {};

export const LoadingScreen = (props: Props) => {
  const [dots, setDots] = useState(""); // Stan dla kropek

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "")); // Animacja kropek
    }, 500);

    return () => clearInterval(interval); // Czyszczenie interwału po demontażu komponentu
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">Przygotuj się</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Już za chwilę wybierzesz <br /> swoją postać
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <Garnek />
        {/* Napis nieruchomy, a kropki się zmieniają */}
        <p className="text-center mt-4">
          Gotujemy dla ciebie opowieść<span>{dots}</span>
        </p>
      </div>
    </div>
  );
};

"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Voices } from "./ui/Voices";

interface Voice {
  id: number;
  name: string;
}

export const ChooseVoices = () => {
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);

  const voices: Voice[] = [
    { id: 1, name: "Głos 1" },
    { id: 2, name: "Głos 2" },
    { id: 3, name: "Głos 3" },
    { id: 4, name: "Głos 4" },
  ];

  const handleVoiceSelect = (id: number) => {
    setSelectedVoice(id);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold mt-20">Wybierz głos</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Tym głosem będzie czytana <br /> Twoja opowieść
        </p>
      </div>

      {/* Lista głosów */}
      <div className="grid grid-cols-2 gap-2 pb-4 overflow-y-scroll max-h-96 scrollbar-hide">
        {voices.map((voice) => (
          <Voices
            key={voice.id}
            name={voice.name}
            isSelected={voice.id === selectedVoice}
            onClick={() => handleVoiceSelect(voice.id)}
          />
        ))}
      </div>

      <div className="mb-4 flex justify-center w-full">
        <Button className="w-auto">Zaczynamy!</Button>
      </div>
    </div>
  );
};

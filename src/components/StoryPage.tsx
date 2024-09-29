/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Button } from "./ui/Button";
import { generateStoryStepsAction } from "@/app/_actions/generateStorySteps";
import { createNewStory } from "@/app/_actions/story.actions";

type Props = {
  extractedText: string;
  keyConcepts: string[];
};

export const StoryPage = (props: Props) => {
  const handleCreateStory = async () => {
    const storySteps = await generateStoryStepsAction(
      props.extractedText,
      props.keyConcepts,
    );

    // add logic to save story to db

    await createNewStory(storySteps.title, storySteps.steps);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full px-4">
      <div>
        <h1 className="text-3xl not-italic font-bold">Kluczowe zagadnienia</h1>
        <p className="text-lg not-italic font-medium leading-6 py-4">
          Z załadowanego materiału stworzyliśmy dla ciebie treści łatwe do nauki
        </p>
      </div>

      {/* Kontener z przyciskiem po prawej stronie */}
      <div className="flex items-center justify-end w-full mt-4">
        <div className="second-bg py-1 px-3 rounded-full cursor-pointer flex items-center gap-2 ml-auto">
          Edytuj / Dodaj więcej
        </div>
      </div>

      {/* Sekcja "srodek" zajmująca maksymalnie dużo miejsca */}
      <div className="flex-grow flex flex-col justify-center w-full gap-2">
        {props.keyConcepts.map((concept, idx) => (
          <p key={idx}>{concept}</p>
        ))}
      </div>

      <div className="mb-4">
        <Button onClick={handleCreateStory}>Stwórz historie</Button>
      </div>
    </div>
  );
};

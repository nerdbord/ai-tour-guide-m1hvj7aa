"use client";
import { useState } from "react";
import { Story } from "@/app/types";

const story: Story = {
  steps: [
    {
      type: "narration",
      content:
        "Znajdujesz się w starożytnym Rzymie, stojąc pośrodku tętniącego życiem targu pełnego kupców i obywateli.",
    },
    {
      type: "decision",
      question: "Gdzie chciałbyś pójść najpierw?",
      options: [
        {
          optionText: "Odwiedź wspaniałe Koloseum",
          generationParameters: {
            nextTopic: "koloseum",
            contextUpdates: { currentLocation: "koloseum" },
          },
        },
        {
          optionText: "Przejdź się po Forum Romanum",
          generationParameters: {
            nextTopic: "forum_romanum",
            contextUpdates: { currentLocation: "forum_romanum" },
          },
        },
      ],
    },
    {
      type: "narration",
      content:
        "Wybierasz się do Koloseum, podziwiając monumentalne ruiny starożytnego amfiteatru.",
    },
  ],
  pastDecisions: [],
  context: {},
};

export default function Reading() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleDecision = () => {
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="max-w-lg p-6 text-center space-y-4">
        {story.steps.map((step, index) => {
          if (index !== currentStep) return null;

          if (step.type === "narration") {
            return (
              <div key={index}>
                <p className="text-lg text-gray-300 mb-6">{step.content}</p>
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                  Kontynuuj
                </button>
              </div>
            );
          }

          if (step.type === "decision") {
            return (
              <div key={index}>
                <p className="text-xl text-white font-semibold mb-4">
                  {step.question}
                </p>
                {step.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="block w-full py-2 bg-gray-800 text-gray-300 text-left px-4 mb-2 rounded hover:bg-gray-700 transition-colors"
                    onClick={handleDecision}
                  >
                    {option.optionText}
                  </button>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

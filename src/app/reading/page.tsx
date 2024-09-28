"use client";
import { useState, useEffect, useRef } from "react";

type StoryStep = Narration | Decision;

interface Narration {
  type: "narration";
  content: string;
  audioUrl: string; // URL to the audio file for narration
}

interface Decision {
  type: "decision";
  question: string;
  options: string[];
}

const storySteps: StoryStep[] = [
  {
    type: "narration",
    content:
      "Znajdujesz się w starożytnym Rzymie, stojąc pośrodku tętniącego życiem targu pełnego kupców i obywateli.",
    audioUrl: "../../audio/narration1.mp3",
  },
  {
    type: "narration",
    content:
      "Przed sobą widzisz wspaniałe Koloseum, które dominuje nad całym miastem.",
    audioUrl: "../../audio/narration2.mp3",
  },
  {
    type: "decision",
    question: "Gdzie chciałbyś pójść najpierw?",
    options: ["Odwiedź Koloseum", "Przejdź się po Forum Romanum"],
  },
  {
    type: "narration",
    content:
      "Wybierasz się do Koloseum, podziwiając monumentalne ruiny starożytnego amfiteatru.",
    audioUrl: "../../audio/narration3.mp3",
  },
];

export default function StarWarsNarrative() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (
      started &&
      storySteps[currentStep].type === "narration" &&
      audioRef.current
    ) {
      audioRef.current.src = (storySteps[currentStep] as Narration).audioUrl;
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
      setIsAudioPlaying(true);
    }
  }, [currentStep, started]);

  const handleAudioEnd = () => {
    setIsAudioPlaying(false);
    if (storySteps[currentStep + 1]?.type === "decision") {
      // If the next step is a decision, do not automatically proceed
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleDecision = () => {
    setCurrentStep((prev) => prev + 1);
    setIsAudioPlaying(true);
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden p-6">
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setStarted(true)}
          >
            Start Narrative
          </button>
        </div>
      )}

      {started && (
        <div>
          {storySteps.map((step, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index <= currentStep ? "opacity-100" : "opacity-0"
              } ${step.type === "narration" ? "text-yellow-500" : ""}`}
            >
              {step.type === "narration" && (
                <p className="text-2xl font-bold mb-4">{step.content}</p>
              )}
              {step.type === "decision" && !isAudioPlaying && (
                <div className="text-center space-y-4">
                  <p className="text-white text-xl mb-4">{step.question}</p>
                  {step.options.map((option, index) => (
                    <button
                      key={index}
                      className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
                      onClick={handleDecision}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <audio ref={audioRef} onEnded={handleAudioEnd} className="hidden" />
        </div>
      )}
    </div>
  );
}

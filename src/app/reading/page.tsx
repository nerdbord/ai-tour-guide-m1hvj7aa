"use client";
import { useState, useEffect, useRef } from "react";
import {
  generateStoryStepAudioSlice,
  generateStoryStepTextSlice,
} from "@/app/_actions/story.actions";

// Define the StoryStep types
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
  selectedOption?: string;
}

export default function StarWarsNarrative() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storySteps, setStorySteps] = useState<StoryStep[]>([
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
  ]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (
      started &&
      storySteps[currentStep]?.type === "narration" &&
      audioRef.current
    ) {
      audioRef.current.src = storySteps[currentStep].audioUrl;
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
      setIsAudioPlaying(true);
    }
  }, [currentStep, started, storySteps]);

  const handleAudioEnd = () => {
    setIsAudioPlaying(false);
    const isLastStep = currentStep === storySteps.length - 1;

    if (isLastStep) {
      setStarted(false);
      return;
    }

    if (currentStep < storySteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleDecision = async (option: string) => {
    const stepId = `step-${Date.now()}`;
    const storyId = "your-story-id"; // Replace with actual story ID
    const context = storySteps
      .filter((step): step is Narration => step.type === "narration")
      .map((step) => step.content)
      .join(" ");

    const previousDecisions = storySteps
      .filter((step): step is Decision => step.type === "decision")
      .map((decision) => decision.question);

    try {
      setIsGenerating(true);

      // Generate text for the next step based on context and decision
      const nextSteps = await generateStoryStepTextSlice({
        context,
        text: option,
        storyId,
        stepId,
        previousDecisions,
      });

      if (!nextSteps) {
        throw new Error("Failed to generate text for the story step.");
      }

      const audioPath = await generateStoryStepAudioSlice({
        text: nextSteps.narrativeStep,
        stepId,
        storyId,
      });

      console.log("audioResponse", audioPath);

      if (!audioPath && typeof audioPath !== "string") {
        throw new Error("Failed to generate audio for the story step.");
      }

      // Create new narration step with the audio URL
      const newNarrativeStep: Narration = {
        type: "narration",
        content: nextSteps.narrativeStep,
        audioUrl: audioPath as string,
      };

      const newDecisionStep: Decision = {
        type: "decision",
        question: nextSteps.decisionStep.text,
        options: nextSteps.decisionStep.options,
      };

      // Update the story steps
      setStorySteps((prevSteps) => [
        ...prevSteps,
        newNarrativeStep,
        newDecisionStep,
      ]);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error generating next story step:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-scroll p-6">
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
                <p className="text-3xl font-bold leading-relaxed mb-6">
                  {step.content}
                </p>
              )}
              {step.type === "decision" && !isAudioPlaying && (
                <div className="text-center space-y-4">
                  {!isGenerating && (
                    <p className="text-white text-xl mb-4">{step.question}</p>
                  )}
                  {isGenerating ? (
                    // Loading Indicator
                    <div className="flex justify-center items-center">
                      <div className="loader">Generating...</div>
                    </div>
                  ) : (
                    // Decision Options
                    step.options.map((option, index) => (
                      <button
                        key={index}
                        disabled={isGenerating}
                        className="bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                        onClick={() => handleDecision(option)}
                      >
                        {option}
                      </button>
                    ))
                  )}
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

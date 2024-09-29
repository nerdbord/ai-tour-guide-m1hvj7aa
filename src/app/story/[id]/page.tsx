/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useState, useEffect, useRef } from "react";
import {
  createStep,
  fetchStoryById,
  generateStoryStepAudioSlice,
  generateStoryStepTextSlice,
  updateStep,
} from "@/app/_actions/story.actions";
import { useParams } from "next/navigation";
import { Step } from "@prisma/client";
import { Button } from "@/components/ui/Button";

export default function StarWarsNarrative() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storySteps, setStorySteps] = useState<Step[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = useParams();
  const storyId = params.id as string;

  useEffect(() => {
    fetchStoryById(storyId).then((story) => {
      if (story) {
        setStorySteps(story.steps);
      }
    });
  }, [storyId]);

  useEffect(() => {
    if (
      started &&
      storySteps[currentStep]?.type === "NARRATION" &&
      audioRef.current
    ) {
      // @ts-expect-error
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
    // Check if there's already a decision step available after the current step
    const nextStepIndex = currentStep + 1;
    if (
      nextStepIndex < storySteps.length &&
      storySteps[nextStepIndex]?.type === "NARRATION"
    ) {
      // If a next step is available, just move to the next step
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const context = storySteps
      .filter((step): step is Step => step.type === "NARRATION")
      .map((step) => step.content)
      .join(" ");

    const previousDecisions = storySteps
      .filter((step): step is Step => step.type === "DECISION")
      .map((decision) => decision.content || "");

    try {
      setIsGenerating(true);

      // Generate text for the next step based on context and decision
      const nextSteps = await generateStoryStepTextSlice({
        context,
        text: option,
        previousDecisions,
      });

      const narrativeStep = await createStep(storyId, {
        type: "NARRATION",
        question: null,
        options: [],
        selectedOption: null,
        story: {
          connect: {
            id: storyId,
          },
        },
        order: storySteps.length,
        content: nextSteps?.narrativeStep[0] || "",
      });

      if (!narrativeStep) {
        throw new Error("Failed to generate text for the story step.");
      }

      const decisionStep = await createStep(storyId, {
        type: "DECISION",
        content: nextSteps?.decisionStep.text || "",
        audioUrl: null,
        question: nextSteps?.decisionStep.text || "",
        options: nextSteps?.decisionStep.options,
        selectedOption: null,
        order: storySteps.length + 1,
        story: {
          connect: {
            id: storyId,
          },
        },
      });

      if (!decisionStep) {
        throw new Error("Failed to generate text for the story step.");
      }

      if (!nextSteps) {
        throw new Error("Failed to generate text for the story step.");
      }

      const audioPath = await generateStoryStepAudioSlice({
        text: narrativeStep.content,
        stepId: narrativeStep.id,
        storyId,
      });

      if (!audioPath && typeof audioPath !== "string") {
        throw new Error("Failed to generate audio for the story step.");
      }

      const updatedNarrativeStep = await updateStep(narrativeStep.id, {
        audioUrl: audioPath as string,
      });

      // Update the story steps
      setStorySteps((prevSteps) => [
        ...prevSteps,
        updatedNarrativeStep,
        decisionStep,
      ]);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error generating next story step:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="main-bg relative h-screen bg-black overflow-y-scroll p-6 scrollbar-hide">
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={() => setStarted(true)}>Rozpocznij opowieść</Button>
        </div>
      )}

      {started && (
        <div>
          {storySteps.map((step, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index <= currentStep ? "opacity-100" : "opacity-0"
              } ${step.type === "NARRATION" ? "text-yellow-500" : ""}`}
            >
              {step.type === "NARRATION" && (
                <p className="text-3xl font-bold leading-relaxed mb-6">
                  {step.content}
                </p>
              )}
              {step.type === "DECISION" && !isAudioPlaying && (
                <div className="text-center space-y-4">
                  <p className="text-white text-xl mb-4">{step.content}</p>
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

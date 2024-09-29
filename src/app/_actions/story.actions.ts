"use server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GPTStoryStepType } from "@/services/gpt.service";
import { redirect } from "next/navigation";
import { Step } from "@prisma/client";

const elevenlabs = new ElevenLabsClient();

const StoryStepSchema = z.object({
  narrativeStep: z.string(),
  decisionStep: z.object({
    text: z.string(),
    options: z.array(z.string()),
  }),
});

export type StoryStepType = z.infer<typeof StoryStepSchema>;

export const fetchStoryById = async (storyId: string) => {
  return await prisma.story.findUnique({
    where: {
      id: storyId,
    },
    include: {
      steps: true,
    },
  });
};

export const createStep = async (storyId: string, step: Step) => {
  if (step.type === "DECISION") {
    const createdStep = await prisma.step.create({
      data: {
        storyId,
        type: step.type,
        content: step.question || "",
        options: step.options,
        audioUrl: "",
        order: 0,
      },
    });
    return createdStep;
  }

  if (step.type === "NARRATION") {
    const createdStep = await prisma.step.create({
      data: {
        storyId,
        type: step.type,
        content: step.content,
        question: step.content,
        audioUrl: "",
        order: 0,
      },
    });
    return createdStep;
  }
};

// Function to create a new story
export const createNewStory = async (
  title: string,
  steps: GPTStoryStepType[],
) => {
  const story = await prisma.story.create({
    data: {
      title,
    },
  });

  // Get the current step count to determine the order
  let stepOrder = 0;

  for (const step of steps) {
    if (step.type === "DECISION") {
      await prisma.step.create({
        data: {
          storyId: story.id,
          type: step.type,
          content: step.question,
          options: step.options,
          audioUrl: "",
          order: stepOrder++,
        },
      });
    }

    if (step.type === "NARRATION") {
      const createdStep = await prisma.step.create({
        data: {
          storyId: story.id,
          type: step.type,
          content: step.content,
          question: step.content,
          audioUrl: "",
          order: stepOrder++,
        },
      });
      const generatedAudio = await generateStoryStepAudioSlice({
        text: step.content,
        storyId: story.id,
        stepId: createdStep.id,
      });

      await prisma.step.update({
        where: {
          id: createdStep.id,
        },
        data: {
          audioUrl: generatedAudio as string,
        },
      });
    }
  }

  redirect(`/story/${story.id}`);
};

export const generateStoryStepTextSlice = async (params: {
  context: string;
  text: string;
  storyId: string;
  stepId: string;
  previousDecisions: string[];
}) => {
  // Updated to return string or null
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: StoryStepSchema,
      prompt: `
        Your goal is to generate the next story step based on the context and previous decisions. 
        Context: ${params.context}. 
        Previous decisions: ${params.previousDecisions.join(", ")}. 
        Text to generate: ${params.text}
      `,
    });
    console.log("gen text done", object);
    return object; // Ensure returning a string
  } catch (error) {
    console.error("Error generating story text:", error);
    return null; // Return null in case of an error
  }
};

// Function to generate audio and save it
export const generateStoryStepAudioSlice = async (params: {
  text: string;
  storyId: string;
  stepId: string;
}) => {
  try {
    console.log("Starting audio generation...");

    // Generate audio using ElevenLabs API
    const audioStream = await elevenlabs.generate({
      voice: "Brian",
      text: params.text,
      model_id: "eleven_turbo_v2_5",
    });

    // Define the output file path
    const outputPath = `/audio/audio_${params.storyId}_${params.stepId}.mp3`;

    // Create a writable stream to the output file
    const writeStream = fs.createWriteStream("public" + outputPath);

    // Pipe the audio stream to the file
    audioStream.pipe(writeStream);

    // Return a promise that resolves when the file is fully written
    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log("Audio saved successfully at", outputPath);
        resolve(outputPath);
      });

      writeStream.on("error", (err) => {
        console.error("Error writing audio to file:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error generating story audio:", error);
    return null;
  }
};

"use server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GPTStoryStepType } from "@/services/gpt.service";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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

  console.log("story", story);

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
      console.log("step", step);
    }

    if (step.type === "NARRATION") {
      await prisma.step.create({
        data: {
          storyId: story.id,
          type: step.type,
          content: step.content,
          audioUrl: "",
          order: stepOrder++,
        },
      });
      console.log("step", step);
    }
  }
  return story;
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
    console.log("gen text");
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

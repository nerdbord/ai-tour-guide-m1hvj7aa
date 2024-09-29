"use server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GPTStoryStepType } from "@/services/gpt.service";
import { redirect } from "next/navigation";
import { Prisma, Step } from "@prisma/client";
import { put } from "@vercel/blob";
import { PassThrough } from "node:stream";

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

export const createStep = async (
  storyId: string,
  step: Prisma.StepCreateInput,
) => {
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

export const updateStep = async (stepId: string, data: Partial<Step>) => {
  return await prisma.step.update({
    where: {
      id: stepId,
    },
    data,
  });
};

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

    // Use a PassThrough stream to handle the stream properly
    const passThroughStream = new PassThrough();

    // Pipe the audio stream into the pass-through stream
    audioStream.pipe(passThroughStream);

    const audioBuffer = await streamToBuffer(passThroughStream);

    // Define the file name for the blob storage
    const filename = `audio_${params.storyId}_${params.stepId}.mp3`;

    // Upload the audio buffer to Vercel Blob storage
    const blobResult = await put(filename, audioBuffer, {
      access: "public",
    });

    console.log("Audio uploaded successfully to", blobResult.url);

    // Return the URL of the uploaded audio file
    return blobResult.url;
  } catch (error) {
    console.error("Error generating story audio:", error);
    return null;
  }
};

// Helper function to convert a stream to a buffer
const streamToBuffer = async (stream: PassThrough): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

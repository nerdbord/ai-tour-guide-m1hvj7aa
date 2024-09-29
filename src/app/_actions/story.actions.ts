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

const StoryStepSchema = z
  .object({
    narrativeSteps: z
      .array(
        z
          .string()
          .describe(
            "A narrative step that continues the story, providing descriptive and engaging content.",
          ),
      )
      .describe("An array of two narrative steps."),
    decisionStep: z
      .object({
        text: z
          .string()
          .describe(
            "A question posed to the player that requires a decision based on the story context.",
          ),
        options: z
          .array(
            z
              .string()
              .describe(
                "A possible choice the player can make in response to the decision question.",
              ),
          )
          .min(2)
          .describe("An array of at least two decision options."),
      })
      .describe("An interactive decision step following the narrative steps."),
  })
  .describe(
    "An object containing two narrative steps and one decision step to continue the story.",
  );

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
        order: step.order || 0,
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
        order: step.order || 0,
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
  try {
    const { object } = await generateObject({
      model: openai("gpt-4"),
      schema: StoryStepSchema,
      prompt: `
        Jesteś asystentem ucznia pomagającym w tworzeniu opowieści edukacyjnych. Na podstawie kontekstu, poprzednich decyzji i wyboru gracza, wygeneruj dwa kolejne etapy narracyjne oraz jeden etap decyzyjny.

        - **Kontekst:** ${params.context}
        - **Poprzednie decyzje:** ${params.previousDecisions.join(", ")}
        - **Wybór gracza:** ${params.text}

        **Zadanie:**
        - Wygeneruj **dwa** etapy narracyjne, które logicznie kontynuują historię.
        - Następnie wygeneruj **jeden** etap decyzyjny z pytaniem i opcjami wyboru.
        - Odpowiedź zwróć w następującym formacie JSON:

        {
          "narrativeSteps": ["Pierwszy etap narracyjny", "Drugi etap narracyjny"],
          "decisionStep": {
            "text": "Pytanie dla gracza",
            "options": ["Opcja 1", "Opcja 2", "Opcja 3"]
          }
        }
      `,
    });
    console.log("Generated text:", object);
    return object; // Returns an object conforming to StoryStepType
  } catch (error) {
    console.error("Error generating story text:", error);
    return null;
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

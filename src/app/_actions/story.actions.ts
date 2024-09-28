"use server";
import { ElevenLabsClient, play } from "elevenlabs";
import * as fs from "node:fs";
import path from "node:path";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Readable } from "node:stream";

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

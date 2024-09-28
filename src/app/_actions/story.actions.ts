"use server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import path from "node:path";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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

// Convert a readable stream to a buffer
const streamToBuffer = (
  readableStream: NodeJS.ReadableStream,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", (err) => reject(err));
  });
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

export const generateStoryStepAudioSlice = async (params: {
  text: string;
  storyId: string;
  stepId: string;
}): Promise<string | null> => {
  // Updated return type to include null
  try {
    console.log("gen audio");
    const audioStream = await elevenlabs.generate({
      voice: "Rachel",
      text: params.text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert the stream to a buffer
    const audioBuffer = await streamToBuffer(audioStream);

    console.log("audioBuffer", audioBuffer);

    // Define the file path
    const filePath = path.join(
      process.cwd(),
      "public",
      "stories",
      params.storyId,
      `${params.stepId}.mp3`,
    );

    console.log("filePath", filePath);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Save the audio file
    fs.writeFileSync(filePath, audioBuffer);

    console.log(`Audio saved successfully at: ${filePath}`);
    return filePath; // Return the file path as a string
  } catch (error) {
    console.error("Error generating story audio:", error);
    return null; // Return null in case of an error
  }
};

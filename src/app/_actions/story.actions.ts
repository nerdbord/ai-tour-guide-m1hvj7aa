"use server";
import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import path from "node:path";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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
  text: string;
  storyId: string;
  stepId: string;
}) => {
  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: "",
    });
  } catch (error) {
    console.error("Error generating story slice:", error);
    return error;
  }
};

export const generateStoryStepAudioSlice = async (params: {
  text: string;
  storyId: string;
  stepId: string;
}) => {
  try {
    const audioStream = await elevenlabs.generate({
      voice: "Rachel",
      text: params.text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert the stream to a buffer
    const audioBuffer = await streamToBuffer(audioStream);

    // Define the file path
    const filePath = path.join(
      process.cwd(),
      "public",
      "stories",
      params.storyId,
      `${params.stepId}.mp3`,
    );

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Save the audio file
    fs.writeFileSync(filePath, audioBuffer);

    console.log(`Audio saved successfully at: ${filePath}`);
  } catch (error) {
    console.error("Error generating story slice:", error);
    return error;
  }
};

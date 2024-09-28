import { generateObject } from "ai";
import { openai } from "../../openai.config";
import { z } from "zod";

const storyContextSchema = z.object({
  extractedText: z.string(),
  keyConcepts: z.array(z.string()),
});

export const convertImgToText = async (prompt: string, imgUrls: string[]) => {
  const resp = await generateObject({
    model: openai("gpt-4o"),
    schema: storyContextSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...imgUrls.map(u => ({ type: "image" as const, image: u })),
        ],
      },
    ],
  });

  return resp.object;
};

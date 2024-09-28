import { generateText } from "ai";

import { openai } from "../../openai.config";

export const convertImgToText = async (prompt: string, imgUrls: string[]) => {
  const resp = await generateText({
    model: openai("gpt-4o"),
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

  return resp.text;
};

import { generateText } from "ai";

import { openai } from "../../openai.config";

export const convertImgToText = async (prompt: string, imgUrl: string) => {
  const resp = await generateText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: imgUrl },
        ],
      },
    ],
  });

  return resp.text;
};

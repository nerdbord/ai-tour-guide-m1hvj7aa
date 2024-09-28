"use server";

import { generateStorySteps } from "@/services/gpt.service";

export const generateStoryStepsAction = async (
  text: string,
  keyConcepts: string[],
) => {
  return await generateStorySteps(text, keyConcepts);
};

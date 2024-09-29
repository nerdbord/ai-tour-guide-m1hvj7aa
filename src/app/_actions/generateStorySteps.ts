import { generateStorySteps } from "@/services/gpt.service";

export const generateStoryStepsAction = async (
  text: string,
  keyConcepts: string[],
) => {
  const resp = await generateStorySteps(text, keyConcepts);

  return resp;
};

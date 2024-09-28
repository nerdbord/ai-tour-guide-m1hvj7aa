"use server";

import { convertImgToText } from "@/services/gpt.service";

export const generateTextFromImage = async (imageURLs: string[]) => {
  const resp = await convertImgToText(imageURLs);

  return resp;
};

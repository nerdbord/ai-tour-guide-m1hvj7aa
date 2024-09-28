"use server";

import { convertImgToText } from "@/services/gpt.service";

export const generateTextFromImage = async (imageURL: string) => {
  const prompt =
    "Jesteś wirtualnym asystentem, który otrzyma zdjęcie tekst. Twoim zadaniem będzie wyciągniecie i zwrócenie tego tekstu jako string. Zwróć tylko tekst ze zdjęcia. Nie dodawaj dodatkowych opisów i informacji.";

  const resp = await convertImgToText(prompt, imageURL);

  return resp;
};

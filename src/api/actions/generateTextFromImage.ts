"use server";

import { convertImgToText } from "@/services/gpt.service";

export const generateTextFromImage = async (imageURL: string) => {
  const prompt =
    "Jesteś wirtualnym asystentem ucznia i otrzymasz zdjęcia materiałów do nauki. Zdjęcia będą pochodziły z podręcznika, z notatek, ze slajdów lub z ćwiczeń. Twoim zadaniem będzie wyciągniecie i zwrócenie tego tekstu jako string. Zwróć tylko tekst ze zdjęcia. Nie dodawaj dodatkowych opisów i informacji.";

  const resp = await convertImgToText(prompt, imageURL);

  return resp;
};

"use server";

import { convertImgToText } from "@/services/gpt.service";

export const generateTextFromImage = async (imageURLs: string[]) => {
  const prompt =
    "Jesteś wirtualnym asystentem ucznia i otrzymasz zdjęcia materiałów do nauki. Zdjęcia będą pochodziły z podręcznika, z notatek, ze slajdów lub z ćwiczeń. Twoim zadaniem będzie wyciągniecie tego tekstu i zapisanie go w postaci string pod właściwością {extractedText} oraz kluczowych elementów, których uczeń powinien się nauczyć i zapisanie ich w postaci tablicy stringów pod właściwością {keyConcepts}. Zwróć tylko te dane, nic więcej.";

  const resp = await convertImgToText(prompt, imageURLs);

  return resp;
};

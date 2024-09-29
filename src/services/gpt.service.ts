import { generateObject } from "ai";
import { openai } from "../../openai.config";
import { z } from "zod";

const StoryContextSchema = z.object({
  extractedText: z.string(),
  keyConcepts: z.array(z.string()),
});

const NarrationSchema = z
  .object({
    type: z.literal("NARRATION").describe('Uppercase "NARRATION"'),
    content: z.string(),
  })
  .describe("NARRATION");

const DecisionSchema = z.object({
  type: z.literal("DECISION").describe('Uppercase "DECISION"'),
  question: z.string(),
  options: z
    .array(z.string())
    .describe(
      "Possible actions to be taken by user in the context of the question.",
    ),
});

const StoryStepSchema = z.union([NarrationSchema, DecisionSchema]);

const StoryStepsSchema = z.object({
  title: z.string(),
  steps: z.array(z.union([NarrationSchema, DecisionSchema])),
});

export type GPTStoryStepType = z.infer<typeof StoryStepSchema>;

export const convertImgToText = async (imgUrls: string[]) => {
  const PROMPT =
    "Jesteś wirtualnym asystentem ucznia i otrzymasz zdjęcia materiałów do nauki. Zdjęcia będą pochodziły z podręcznika, z notatek, ze slajdów lub z ćwiczeń. Twoim zadaniem będzie wyciągniecie tego tekstu i zapisanie go w postaci string pod właściwością {extractedText} oraz kluczowych zagadnień z tego fragmentu, których uczeń powinien się nauczyć w formie pytań (pamiętaj żeby tak ułożyć pytania, na które odpowiedź jest zawarta w tekscie fragmentu) i zapisanie ich w postaci tablicy stringów pod właściwością {keyConcepts}. Zwróć tylko te dane, nic więcej.";

  const resp = await generateObject({
    model: openai("gpt-4o"),
    schema: StoryContextSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          ...imgUrls.map((u) => ({ type: "image" as const, image: u })),
        ],
      },
    ],
  });

  return resp.object;
};

export const generateStorySteps = async (
  text: string,
  keyConcepts: string[],
) => {
  const str = keyConcepts.join("");

  const PROMPT = `Jesteś asystentem ucznia pomagającym w nauce poprzez tworzenie ciekawych historii na bazie przekazanych materiałów. 
  Materiały zawierają tekst z podręcznika ${text} oraz kilka zagadnień ${str} które uczeń ma przyswoić w klimacie role playing gdzie uczestniczy w wydarzeniach z historii wcielając się w postać historyczną. 
  Zbuduj na podstawie tego tekstu historię, dzieląc ją na etapy narracyjne {type: "NARRATION"} oraz elementy interaktywny, które będą polegały na podjęciu decyzji przez ucznia {type: "DECISION"}. 
  Zwróć tylko etapy do pierwszego etapu typu "decision". Etap typu "decision" powinien pojawić się od razu po fragmencie, który zawiera odpowiedź na pytanie z etapu decyzyjnego. 
  Wymyśl tytuł który opiszę całą historię.`;

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: StoryStepsSchema,
    prompt: PROMPT,
  });

  console.log("Generated story steps:", object);
  return object;
};

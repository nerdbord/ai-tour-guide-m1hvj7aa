// Main story interface
export interface Story {
  steps: StoryStep[];
  context: StoryContext;
  pastDecisions: DecisionRecord[];
}

// Type of a story step, which can be a narration or a decision
type StoryStep = Narration | Decision;

// Interface for a narration step
interface Narration {
  type: "narration";
  content: string;
}

// Interface for a decision step
interface Decision {
  type: "decision";
  question: string;
  options: DecisionOption[];
}

// Interface for a decision option
interface DecisionOption {
  optionText: string;
  generationParameters: GenerationParameters;
}

// Interface for parameters to generate next steps
interface GenerationParameters {
  // Dynamic properties that influence the next part of the story
  [key: string]: unknown;
}

// Story context interface
interface StoryContext {
  // Dynamic properties that represent the current state of the story
  [key: string]: unknown;
}

// Record of a decision made by the user
interface DecisionRecord {
  decisionIndex: number; // Index of the decision step in the steps array
  optionIndex: number; // Index of the selected option in the options array
}

// Main story interface
interface Story {
    steps: StoryStep[];
    context: StoryContext; // Specific context data needed for story generation
}

// Type of a story step, which can be a narration or a decision
type StoryStep = Narration | Decision;

// Interface for a narration step
interface Narration {
    type: 'narration';
    content: string;
}

// Interface for a decision step
interface Decision {
    type: 'decision';
    question: string;
    options: DecisionOption[];
}

// Interface for an option in a decision step
interface DecisionOption {
    optionText: string;
    // Parameters needed to generate subsequent steps based on the user's choice
    generationParameters: GenerationParameters;
}

// Interface for parameters to generate subsequent steps
interface GenerationParameters {
    decision: string; // The user's decision that influences the next part of the story
    topicKeywords: string[]; // Keywords related to the next content to generate
}

// Specific context data needed for story generation
interface StoryContext {
    extractedText: string; // Text extracted from OCR
    keyConcepts: string[]; // Key concepts identified from the extracted text
    userPreferences: UserPreferences; // User-specific settings or preferences
}

// User-specific settings or preferences
interface UserPreferences {
    language: string; // Language of the story
    difficultyLevel: 'easy' | 'medium' | 'hard'; // Difficulty level of the content
    learningGoals: string[]; // Specific learning goals or topics
}

const splitSentences = (text: string) => {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  return matches && matches.length > 0 ? matches.map((sentence) => sentence.trim()) : [text.trim()];
};

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const scoreSentence = (sentence: string, frequency: Record<string, number>) => {
  const words = normalizeText(sentence);
  if (words.length === 0) return 0;
  const score = words.reduce((sum, word) => sum + (frequency[word] || 0), 0);
  return score / words.length;
};

export async function aiSummarize(text: string): Promise<string> {
  const trimmedText = text.trim();
  if (!trimmedText) return "No text provided to summarize.";

  const sentences = splitSentences(trimmedText);
  if (sentences.length <= 3) {
    return `Summary:\n${trimmedText}`;
  }

  const words = normalizeText(trimmedText);
  const frequency = words.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const scored = sentences.map((sentence) => ({ sentence, score: scoreSentence(sentence, frequency) }));
  const topSentences = scored.sort((a, b) => b.score - a.score).slice(0, Math.min(3, sentences.length));
  const summary = topSentences.map((item) => item.sentence).join(" ");

  return `Summary:\n${summary}`;
}

const fallbackTranslation = (text: string, targetLanguage: string) => {
  return `This is a local translation simulation for ${targetLanguage}.\n\n${text}`;
};

export async function aiTranslate(text: string, targetLanguage: string): Promise<string> {
  const trimmedText = text.trim();
  if (!trimmedText) return "No text provided to translate.";
  return fallbackTranslation(trimmedText, targetLanguage);
}

const generateQuestionsFromSentences = (sentences: string[], total: number) => {
  const questions: string[] = [];
  for (const sentence of sentences) {
    if (questions.length >= total) break;
    const trimmed = sentence.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase().startsWith("what")) {
      questions.push(`${trimmed}?`);
    } else if (trimmed.toLowerCase().startsWith("the")) {
      questions.push(`What is ${trimmed.slice(4)}`);
    } else {
      const subject = trimmed.split(" ").slice(0, 5).join(" ");
      questions.push(`What does ${subject} mean?`);
    }
  }

  while (questions.length < total) {
    questions.push(`Can you explain more about this material?`);
  }

  return questions.slice(0, total);
};

export async function aiGenerateQuestions(text: string, questionCount: number = 5): Promise<string> {
  const trimmedText = text.trim();
  if (!trimmedText) return "No text provided to generate questions.";

  const sentences = splitSentences(trimmedText);
  const questions = generateQuestionsFromSentences(sentences, questionCount);
  return questions.map((question, index) => `${index + 1}. ${question}`).join("\n");
}

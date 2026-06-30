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

const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  Spanish: {
    hello: "hola",
    world: "mundo",
    translate: "traducir",
    text: "texto",
    document: "documento",
    summary: "resumen",
    question: "pregunta",
    ai: "IA",
    please: "por favor",
    thank: "gracias",
    you: "tú",
    good: "bueno",
    morning: "día",
    evening: "tarde",
  },
  French: {
    hello: "bonjour",
    world: "monde",
    translate: "traduire",
    text: "texte",
    document: "document",
    summary: "résumé",
    question: "question",
    ai: "IA",
    please: "s'il vous plaît",
    thank: "merci",
    you: "vous",
    good: "bon",
    morning: "matin",
    evening: "soir",
  },
  German: {
    hello: "hallo",
    world: "welt",
    translate: "übersetzen",
    text: "text",
    document: "dokument",
    summary: "zusammenfassung",
    question: "frage",
    ai: "KI",
    please: "bitte",
    thank: "danke",
    you: "du",
    good: "gut",
    morning: "morgen",
    evening: "abend",
  },
  Italian: {
    hello: "ciao",
    world: "mondo",
    translate: "tradurre",
    text: "testo",
    document: "documento",
    summary: "riassunto",
    question: "domanda",
    ai: "IA",
    please: "per favore",
    thank: "grazie",
    you: "tu",
    good: "buono",
    morning: "mattina",
    evening: "sera",
  },
};

const translateText = (text: string, targetLanguage: string) => {
  const dictionary = TRANSLATION_DICTIONARY[targetLanguage];
  if (!dictionary) {
    return text;
  }

  return text
    .split(/(\b)/)
    .map((chunk) => {
      const key = chunk.toLowerCase();
      if (dictionary[key]) {
        const translated = dictionary[key];
        return chunk[0] === chunk[0]?.toUpperCase()
          ? translated.charAt(0).toUpperCase() + translated.slice(1)
          : translated;
      }
      return chunk;
    })
    .join("");
};

const fallbackTranslation = (text: string, targetLanguage: string) => {
  return translateText(text, targetLanguage);
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

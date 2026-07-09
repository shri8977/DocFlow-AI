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

type AICompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const getAIKey = () => {
  const key = [import.meta.env.VITE_GROQ_API_KEY, import.meta.env.GROQ_API_KEY, import.meta.env.VITE_GEMINI_API_KEY, import.meta.env.VITE_AI_API_KEY, import.meta.env.GEMINI_API_KEY, import.meta.env.AI_API_KEY].find(Boolean);
  return typeof key === "string" ? key : "";
};

const callAI = async (prompt: string, systemPrompt: string) => {
  const apiKey = getAIKey();
  if (!apiKey) {
    throw new Error("AI API key is not configured. Set VITE_GROQ_API_KEY in your environment.");
  }

  const isGroq = apiKey.startsWith("gsk_");

  const response = await fetch(
    isGroq
      ? "https://api.groq.com/openai/v1/chat/completions"
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isGroq ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(
        isGroq
          ? {
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 1024,
            }
          : {
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: prompt }] }],
            }
      ),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errorText}`);
  }

  const result = (await response.json()) as AICompletionResponse;
  const text = isGroq
    ? result?.choices?.[0]?.message?.content?.trim()
    : result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  return text;
};

const fallbackSummarize = (text: string) => {
  const trimmedText = text.trim();
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
};

export async function aiSummarize(text: string): Promise<string> {
  const trimmedText = text.trim();
  if (!trimmedText) return "No text provided to summarize.";

  try {
    const summary = await callAI(
      `Summarize the following text clearly and concisely. Keep the main ideas and key details.\n\n${trimmedText.slice(0, 20000)}`,
      "You are a helpful document summarizer. Write clear, factual summaries that preserve the core meaning."
    );
    return summary.trim();
  } catch (error) {
    console.error("AI summarize failed, using fallback:", error);
    return fallbackSummarize(trimmedText);
  }
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
    questions: "preguntas",
    ai: "IA",
    please: "por favor",
    thank: "gracias",
    you: "tú",
    good: "bueno",
    morning: "mañana",
    evening: "tarde",
    permission: "permiso",
    change: "cambiar",
    app: "aplicación",
    run: "ejecutar",
    locally: "localmente",
    without: "sin",
    auth: "autenticación",
    functions: "funciones",
    supabase: "Supabase",
    the: "la",
    to: "a",
    is: "es",
    for: "para",
    and: "y",
    with: "con",
    can: "puede",
    this: "esta",
  },
  French: {
    hello: "bonjour",
    world: "monde",
    translate: "traduire",
    text: "texte",
    document: "document",
    summary: "résumé",
    question: "question",
    questions: "questions",
    ai: "IA",
    please: "s'il vous plaît",
    thank: "merci",
    you: "vous",
    good: "bon",
    morning: "matin",
    evening: "soir",
    permission: "autorisation",
    change: "modifier",
    app: "application",
    run: "exécuter",
    locally: "localement",
    without: "sans",
    auth: "authentification",
    functions: "fonctions",
    supabase: "Supabase",
    the: "le",
    to: "à",
    is: "est",
    for: "pour",
    and: "et",
    with: "avec",
    can: "peut",
    this: "ceci",
  },
  German: {
    hello: "hallo",
    world: "welt",
    translate: "übersetzen",
    text: "text",
    document: "dokument",
    summary: "zusammenfassung",
    question: "frage",
    questions: "fragen",
    ai: "KI",
    please: "bitte",
    thank: "danke",
    you: "du",
    good: "gut",
    morning: "morgen",
    evening: "abend",
    permission: "berechtigung",
    change: "ändern",
    app: "app",
    run: "ausführen",
    locally: "lokal",
    without: "ohne",
    auth: "authentifizierung",
    functions: "funktionen",
    supabase: "Supabase",
    the: "die",
    to: "zu",
    is: "ist",
    for: "für",
    and: "und",
    with: "mit",
    can: "kann",
    this: "diese",
  },
  Italian: {
    hello: "ciao",
    world: "mondo",
    translate: "tradurre",
    text: "testo",
    document: "documento",
    summary: "riassunto",
    question: "domanda",
    questions: "domande",
    ai: "IA",
    please: "per favore",
    thank: "grazie",
    you: "tu",
    good: "buono",
    morning: "mattina",
    evening: "sera",
    permission: "permesso",
    change: "cambiare",
    app: "applicazione",
    run: "eseguire",
    locally: "localmente",
    without: "senza",
    auth: "autenticazione",
    functions: "funzioni",
    supabase: "Supabase",
    the: "il",
    to: "a",
    is: "è",
    for: "per",
    and: "e",
    with: "con",
    can: "può",
    this: "questo",
  },
};

const TRANSLATION_PHRASES: Record<string, Record<string, string>> = {
  Spanish: {
    "permission to change the app to run locally without supabase auth/functions":
      "permiso para cambiar la aplicación y ejecutarla localmente sin autenticación/funciones de Supabase",
    "run locally without supabase auth/functions":
      "ejecutar localmente sin autenticación/funciones de Supabase",
    "permission to change the app": "permiso para cambiar la aplicación",
    "without supabase auth/functions": "sin autenticación/funciones de Supabase",
  },
  French: {
    "permission to change the app to run locally without supabase auth/functions":
      "autorisation de modifier l'application pour l'exécuter localement sans authentification/fonctions Supabase",
    "run locally without supabase auth/functions":
      "exécuter localement sans authentification/fonctions Supabase",
  },
  German: {
    "permission to change the app to run locally without supabase auth/functions":
      "erlaubnis, die app zu ändern, um sie lokal ohne Supabase-authentifizierung/funktionen auszuführen",
    "run locally without supabase auth/functions":
      "lokal ausführen ohne Supabase-authentifizierung/funktionen",
  },
  Italian: {
    "permission to change the app to run locally without supabase auth/functions":
      "permesso di modificare l'app per eseguirla localmente senza autenticazione/funzioni Supabase",
    "run locally without supabase auth/functions":
      "eseguire localmente senza autenticazione/funzioni Supabase",
  },
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

const preserveCase = (original: string, translated: string) => {
  if (original.toUpperCase() === original) return translated.toUpperCase();
  if (original[0] && original[0] === original[0].toUpperCase()) {
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }
  return translated;
};

const translateText = (text: string, targetLanguage: string) => {
  const dictionary = TRANSLATION_DICTIONARY[targetLanguage];
  const phrases = TRANSLATION_PHRASES[targetLanguage] || {};
  if (!dictionary) {
    return text;
  }

  let translated = text;
  const phraseEntries = Object.entries(phrases).sort((a, b) => b[0].length - a[0].length);
  for (const [source, replacement] of phraseEntries) {
    const regex = new RegExp(`\\b${escapeRegExp(source)}\\b`, "gi");
    translated = translated.replace(regex, (match) => preserveCase(match, replacement));
  }

  return translated.replace(/[\\w']+/g, (token) => {
    const key = token.toLowerCase();
    if (dictionary[key]) {
      return preserveCase(token, dictionary[key]);
    }
    return token;
  });
};

const fallbackTranslation = (text: string, targetLanguage: string) => {
  return translateText(text, targetLanguage);
};

export async function aiTranslate(text: string, targetLanguage: string): Promise<string> {
  const trimmedText = text.trim();
  if (!trimmedText) return "No text provided to translate.";

  try {
    const translated = await callAI(
      `Translate the following text to ${targetLanguage}. Preserve the original meaning, tone, and formatting. Return only the translated text.\n\n${trimmedText.slice(0, 20000)}`,
      "You are a professional translator. Return only the translated text and nothing else."
    );
    return translated.trim();
  } catch (error) {
    console.error("AI translate failed, using fallback:", error);
    return fallbackTranslation(trimmedText, targetLanguage);
  }
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

  try {
    const generatedQuestions = await callAI(
      `Generate ${questionCount} comprehension questions from the following text. Number each question and keep them clear and relevant.\n\n${trimmedText.slice(0, 20000)}`,
      "You are an educational assistant. Generate clear, useful comprehension questions."
    );
    return generatedQuestions.trim();
  } catch (error) {
    console.error("AI question generation failed, using fallback:", error);
    const sentences = splitSentences(trimmedText);
    const questions = generateQuestionsFromSentences(sentences, questionCount);
    return questions.map((question, index) => `${index + 1}. ${question}`).join("\n");
  }
}

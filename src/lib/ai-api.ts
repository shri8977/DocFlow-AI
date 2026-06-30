export async function aiSummarize(text: string): Promise<string> {
  return `Summarized text: ${text.slice(0, 200)}${text.length > 200 ? "..." : ""}`;
}

export async function aiTranslate(text: string, targetLanguage: string): Promise<string> {
  return `Translated to ${targetLanguage}: ${text}`;
}

export async function aiGenerateQuestions(text: string, questionCount: number = 5): Promise<string> {
  return Array.from({ length: questionCount }, (_, index) => `Q${index + 1}: ${text.slice(0, 30)}?`).join("\n");
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { text, targetLanguage } = req.body || {};
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Text and target language required' });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI API key not configured' });
    }

    const isGroq = apiKey.startsWith('gsk_');
    const response = await fetch(isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isGroq ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(
        isGroq
          ? {
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: 'You are a professional translator. Return only the translated text and nothing else.' },
                { role: 'user', content: `Translate the following text to ${targetLanguage}. Preserve the original meaning, tone, and formatting. Return only the translated text.\n\n${text.slice(0, 20000)}` },
              ],
              temperature: 0.2,
              max_tokens: 1024,
            }
          : {
              system_instruction: { parts: [{ text: 'You are a professional translator.' }] },
              contents: [{ parts: [{ text: `Translate the following text to ${targetLanguage}. Preserve the original meaning, tone, and formatting. Return only the translated text.\n\n${text.slice(0, 20000)}` }] }],
            }
      ),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ success: false, message: errorText });
    }

    const result = await response.json();
    const translation = isGroq
      ? result?.choices?.[0]?.message?.content?.trim()
      : result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translation) {
      return res.status(502).json({ success: false, message: 'AI returned an empty response' });
    }

    return res.status(200).json({ success: true, translation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Something went wrong' });
  }
}

const SYSTEM_PROMPT = `You are a helpful assistant for a web Tic Tac Toe game. 
Be concise and friendly. Help with:
- Rules: turns, winning conditions, valid moves
- Strategy: center start, forks, blocks, optimal play
- General chat: answer briefly and helpfully
If asked about code or app issues, provide short actionable tips.`;

function getApiKey() {
  // CRA uses REACT_APP_ prefix for env variables exposed to the client
  // The orchestrator provides container_env = REACT_APP_OPENAI_API_KEY
  return process.env.REACT_APP_OPENAI_API_KEY || "";
}

// PUBLIC_INTERFACE
export const openaiClient = {
  /**
   * Calls OpenAI chat completions endpoint (REST v1).
   * Usage: openaiClient.chat({ messages: [{role:'user',content:'...'}] })
   * Returns: { content: string }
   */
  async chat({ messages, model }) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Missing OpenAI API key. Set REACT_APP_OPENAI_API_KEY in .env");
    }

    const url = "https://api.openai.com/v1/chat/completions";
    const body = {
      model: model || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const choice = data?.choices?.[0]?.message?.content || "";
    return { content: choice };
  }
};

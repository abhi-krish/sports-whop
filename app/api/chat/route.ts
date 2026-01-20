import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export const maxDuration = 30;

const SPORTS_SYSTEM_PROMPT = `You are an expert sports analytics assistant for a betting community. You have access to real-time data through web search and X (Twitter) search.

Your expertise covers all major US sports:
- NFL (American Football)
- NBA (Basketball)
- MLB (Baseball)
- NHL (Hockey)
- MLS (Soccer)

When users ask about sports data, you should:

1. **Always search for the latest information** - Use your web search capabilities to get current scores, standings, stats, and news. Never rely on potentially outdated knowledge.

2. **Provide betting-relevant context** - When discussing games, include relevant information like:
   - Recent team performance and trends
   - Head-to-head records
   - Key player injuries or absences
   - Home/away performance
   - Weather conditions (for outdoor sports)

3. **Format data clearly** - Use tables and bullet points for statistics. Make information easy to scan quickly.

4. **Be accurate and honest** - If you can't find specific data, say so. Never make up statistics.

5. **Provide analysis, not betting advice** - You can discuss odds and trends, but remind users that betting involves risk and they should make their own decisions.

Example queries you can help with:
- "What are today's NBA games and the current spreads?"
- "How has Patrick Mahomes performed in his last 5 games?"
- "Show me the current NFL playoff standings"
- "What's the injury report for the Lakers vs Celtics game?"
- "Compare the offensive stats of the top 5 MLB teams"

Always prioritize accuracy and timeliness of information.`;

// Convert UI messages (parts array) to model messages (content string)
function convertMessages(messages: any[]) {
  return messages.map((msg) => {
    // If message already has content string, use it
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }
    // If message has parts array, extract text
    if (msg.parts) {
      const text = msg.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
      return { role: msg.role, content: text };
    }
    return { role: msg.role, content: "" };
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages || [];

  if (!messages.length) {
    return new Response("No messages provided", { status: 400 });
  }

  // Convert UI messages to model messages format
  const modelMessages = convertMessages(messages);

  const result = streamText({
    model: xai("grok-3-latest"),
    system: SPORTS_SYSTEM_PROMPT,
    messages: modelMessages,
    providerOptions: {
      xai: {
        searchParameters: {
          mode: "on", // Force live search for real-time sports data
          returnCitations: true,
          sources: ["web", "x", "news"], // Search web, X posts, and news
          maxSearchResults: 10,
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev

# Production build - ALWAYS run before deploying to catch TypeScript errors
npm run build

# Start production server
npm start

# Lint with Biome
npm run lint
```

## Architecture

This is a sports analytics chatbot using xAI's Grok model.

### Core Stack
- **Next.js 16** with App Router and Turbopack
- **AI SDK v6** (`ai`, `@ai-sdk/react`, `@ai-sdk/xai`)
- **Tailwind CSS v4**

### Key Files

```
app/
├── api/chat/route.ts        # API endpoint - streamText + message conversion
├── components/ChatInterface.tsx  # Client component - useChat hook
├── page.tsx                 # Main page
├── layout.tsx               # Root layout
└── globals.css
```

## AI SDK v6 Critical Information

**This is the most common source of bugs. Read carefully.**

### Message Format Mismatch

The frontend `useChat()` hook and backend `streamText()` use DIFFERENT message formats:

| Component | Format | Example |
|-----------|--------|---------|
| `useChat()` (frontend) | `parts` array | `{ role: "user", parts: [{ type: "text", text: "Hello" }] }` |
| `streamText()` (backend) | `content` string | `{ role: "user", content: "Hello" }` |

**Solution:** The API route must convert messages:

```typescript
function convertMessages(messages: any[]) {
  return messages.map((msg) => {
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }
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
```

### useChat Hook API (v6)

```typescript
const { messages, sendMessage, status, error } = useChat();

// Send a message - use "text" not "content"
await sendMessage({ text: "Hello" });

// Check loading state
const isLoading = status === "streaming" || status === "submitted";

// Render message content from parts
message.parts?.map((part) => part.type === "text" ? part.text : null)
```

**Common mistakes:**
- ❌ `sendMessage({ content: "Hello" })` - wrong property name
- ❌ `message.content` - doesn't exist in v6, use `message.parts`
- ❌ `handleSubmit`, `handleInputChange`, `input` - don't exist in v6

### API Route Pattern

```typescript
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = convertMessages(messages);  // REQUIRED conversion

  const result = streamText({
    model: xai("grok-3-mini"),
    system: "...",
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();  // Use this for useChat compatibility
}
```

## Environment Variables

Required:
- `XAI_API_KEY` - xAI API key for Grok model

## Deployment

- Deploy to Vercel with GitHub repo connected
- `.npmrc` has `legacy-peer-deps=true` for React version conflicts
- **Always run `npm run build` locally before pushing** to catch TypeScript errors

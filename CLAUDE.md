# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs whop-proxy with Next.js Turbopack)
npm run dev

# Production build - ALWAYS run before deploying to catch TypeScript errors
npm run build

# Start production server
npm start

# Lint with Biome
npm run lint
```

## Architecture

This is a Whop B2B app - a sports analytics chatbot that Whop creators install for their community members.

### Core Stack
- **Next.js 16** with App Router and Turbopack
- **AI SDK v6** (`ai`, `@ai-sdk/react`, `@ai-sdk/xai`) - uses xAI's Grok model
- **Whop SDK** (`@whop/react`, `@whop/sdk`) - for Whop platform integration
- **Tailwind CSS v4**

### Key Files

**Chat System:**
- `app/api/chat/route.ts` - API endpoint using `streamText()` with `toUIMessageStreamResponse()`
- `app/components/ChatInterface.tsx` - Client component using `useChat()` hook

**Whop Integration:**
- `app/layout.tsx` - Wraps app with `<WhopApp>` provider
- `lib/whop-sdk.ts` - Whop SDK instance configuration
- `app/experiences/[experienceId]/page.tsx` - Member-facing app view
- `app/dashboard/[companyId]/page.tsx` - Creator dashboard view
- `app/discover/page.tsx` - App store discovery page

### AI SDK v6 Specifics

The `useChat()` hook in v6 has a different API than earlier versions:
- Returns `{ messages, sendMessage, status, error }` (not `handleSubmit`, `handleInputChange`, `input`)
- Send messages with `sendMessage({ text: "message" })` (not `content`)
- Check loading state with `status === "streaming" || status === "submitted"`
- Messages have `parts` array with `{ type: "text", text: "..." }` format

## Environment Variables

Required for the chatbot:
- `XAI_API_KEY` - xAI API key for Grok model

Optional for Whop features:
- `NEXT_PUBLIC_WHOP_APP_ID` - Whop app identifier
- `WHOP_API_KEY` - For server-side Whop SDK calls
- `WHOP_WEBHOOK_SECRET` - For webhook verification

## Deployment

Deploy to Vercel with the GitHub repo connected. The `.npmrc` file sets `legacy-peer-deps=true` to handle React version conflicts.

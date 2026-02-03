# AGENTS.md - AI Package (@repo/ai)

## Overview

AI integration utilities using Vercel AI SDK with OpenAI.

## File Structure

```
packages/ai/
├── index.ts            # Main exports
├── keys.ts             # Environment variable validation
└── package.json
```

## Commands

```bash
pnpm typecheck  # TypeScript type checking
```

## Dependencies

### Key External Dependencies
- `ai` - Vercel AI SDK (v5.x)
- `@ai-sdk/openai` - OpenAI provider
- `streamdown` - Streaming markdown utilities

## Environment Variables

**Server-side (secret):**
```
OPENAI_API_KEY    # OpenAI API key (starts with sk-, optional)
```

From `keys.ts`:
```typescript
server: {
  OPENAI_API_KEY: z.string().startsWith("sk-").optional(),
}
```

## Key Patterns

### Text Generation
```typescript
import { generateText } from "@repo/ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4-turbo"),
  prompt: "Write a haiku about coding",
});
```

### Streaming Text
```typescript
import { streamText } from "@repo/ai";
import { openai } from "@ai-sdk/openai";

const stream = await streamText({
  model: openai("gpt-4-turbo"),
  prompt: "Explain quantum computing",
});

for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

### Chat Completions
```typescript
import { generateText } from "@repo/ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4-turbo"),
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" },
  ],
});
```

### Streaming UI (React)
```typescript
"use client";
import { useChat } from "@repo/ai";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
```

## API Route Pattern
```typescript
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });
  
  return result.toDataStreamResponse();
}
```

## Security Considerations

- `OPENAI_API_KEY` is highly sensitive - never expose to client
- Always run AI operations server-side
- Implement rate limiting on AI endpoints
- Validate and sanitize user inputs before sending to AI
- Set appropriate token limits to control costs
- Consider content moderation for user-generated prompts
- Monitor API usage and set spending alerts

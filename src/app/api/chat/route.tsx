import { type CoreMessage, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { systemPrompt } from './systemPrompt'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: openai("o4-mini"),
    // model: google("models/gemini-2.0-flash-exp"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}

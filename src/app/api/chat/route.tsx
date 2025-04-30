import { type CoreMessage, generateText} from "ai"
import { openai } from "@ai-sdk/openai"
import { systemPrompt } from './systemPrompt'
import { NextResponse } from 'next/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  try {
    const { text, finishReason, usage } = await generateText({
      model: openai("o4-mini"),
      system: systemPrompt,
      messages,
    })
  
    return NextResponse.json({ text, finishReason, usage })
  } catch (error) {
    console.error(error)
    return new Response("An error occurred", { status: 500 })
  }
}

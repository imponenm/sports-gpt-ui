import { type CoreMessage, generateText} from "ai"
import { openai } from "@ai-sdk/openai"
import { nbaPrompt } from './nbaPrompt'
import { nflPrompt } from './nflPrompt'
import { NextResponse } from 'next/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, sport }: { messages: CoreMessage[], sport: "NBA" | "NFL" } = await req.json()

  if (!sport || !["NBA", "NFL"].includes(sport)) {
    return new Response("Sport parameter is required and must be either 'NBA' or 'NFL'", { status: 400 })
  }

  try {
    const { text, finishReason, usage } = await generateText({
      model: openai("o4-mini"),
      system: sport === "NBA" ? nbaPrompt : nflPrompt,
      messages,
    })
  
    return NextResponse.json({ text, finishReason, usage })
  } catch (error) {
    console.error(error)
    return new Response("An error occurred", { status: 500 })
  }
}

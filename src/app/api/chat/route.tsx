import { type CoreMessage, streamText} from "ai"
import { openai } from "@ai-sdk/openai"
import { systemPrompt } from './systemPrompt'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: openai("o4-mini"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()

  // try {
  //   const { text } = await generateText({
  //     model: openai("o4-mini"),
  //     system: systemPrompt,
  //     messages,
  //   })
  
  //   return NextResponse.json({ text: text, success: true})
  // } catch (error) {
  //   console.error(error)
  //   return new Response("An error occurred", { status: 500 })
  // }
}

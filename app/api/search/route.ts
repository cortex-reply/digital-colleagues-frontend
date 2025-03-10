import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4-turbo"),
    system:
      "You are an AI assistant for a project management system. You have access to information about business functions, projects, tasks, and team members. Provide helpful and accurate responses to queries about the organization and its work.",
    messages,
  })

  return result.toDataStreamResponse()
}


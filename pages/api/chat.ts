import { type ChatGPTMessage } from '../../utils/Message'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'


export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  // break if the API key is missing
  if (!process.env.OPENAI_API_KEY) {
    const options = { status: 500, statusText: "Config error" };
    const resp = new Response('Missing Environment Variable OPENAI_API_KEY', options)
    return resp
  }

  const body = await req.json()
  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `You are a helpful assistant. Today is ${new Date().toLocaleDateString()}`,
    },
  ]
  messages.push(...body?.messages)
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  }

  if (process.env.OPENAI_API_ORG) {
    requestHeaders['OpenAI-Organization'] = process.env.OPENAI_API_ORG
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : undefined,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
  }

  const stream = await OpenAIStream(payload)
  return stream
}
export default handler
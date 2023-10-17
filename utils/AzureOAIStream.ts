import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser'

import { OpenAIStreamPayload } from './OpenAIStream'

export async function AzureOAIStream(payload: OpenAIStreamPayload) {
  try {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
  
    let counter = 0
  
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'api-key': `${process.env.OPENAI_API_KEY ?? ''}`,
    }

    let requrl = process.env.AZUREAOI_URL;
    if (payload.model == 'gpt4') {
      console.log('gpt4')
      requrl = requrl?.replace('gpt35', 'gpt4');
    }

    if (!requrl) {
      const options = { status: 500, statusText: "API error" };
      const resp = new Response(`Exception when call OpenAI API: no AZUREAOI_URL`, options)
      return resp
    }

    const res = await fetch(requrl, {
      headers: requestHeaders,
      method: 'POST',
      body: JSON.stringify(payload),
    })
  
    if (res.status !== 200) {
      console.log(`Error response from OpenAI: ${res.status} ${res.statusText} ${res.body}`)
      return res
    }
  
    const stream = new ReadableStream({
      async start(controller) {
        // callback
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === 'event') {
            const data = event.data
            // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
            if (data === '[DONE]') {
              console.log('DONE')
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const text = json.choices[0]?.delta?.content || ''
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // this is a prefix character (i.e., "\n\n"), do nothing
                return
              }
              const queue = encoder.encode(text)
              controller.enqueue(queue)
              counter++
            } catch (e) {
              // maybe parse error
              controller.error(e)
            }
          }
        }
  
        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks and invoke an event for each SSE event stream
        const parser = createParser(onParse)
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk))
        }
      },
    })
  
    return new Response(stream)
  } catch (e) {
    const options = { status: 500, statusText: "API error" };
    const resp = new Response(`Exception when call OpenAI API: ${e}`, options)
    return resp
  }
 
}

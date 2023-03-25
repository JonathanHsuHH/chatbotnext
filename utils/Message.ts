type ChatGPTAgent = 'user' | 'system' | 'assistant'

export interface ConversationInf {
  title: string
  uniqueId: string
  createTime: number
  contents: ChatGPTMessage[]
}

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export const webSearchPromopt = `Web search results:
{web_results}

Current date: {current_date}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.
Query: {query}`

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
    {
      role: 'user',
      content: "You are " ,
    },{
      role: 'assistant',
      content: "You are" ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible" ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'user',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    },{
      role: 'assistant',
      content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible." ,
    }
  ]
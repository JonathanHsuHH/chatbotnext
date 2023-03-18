type ChatGPTAgent = 'user' | 'system' | 'assistant'

export interface ConversationInf {
  title: string
  uniqueId: string
  contents: ChatGPTMessage[]
}

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

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
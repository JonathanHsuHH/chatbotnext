import { ChatGPTMessage, ConversationInf, initialMessages, webSearchPromopt } from '../utils/Message'
import { ChatLine, LoadingChatLine } from './ChatLine'
import { PluginConfig, webSearch } from '../utils/Plugin'
import { useContext, useEffect, useRef, useState } from 'react'

import { Button } from './Button'
import { ConversationContext } from './Context';
import toast from 'react-hot-toast'
import { useCookies } from 'react-cookie'

const COOKIE_NAME = 'ai-chat-gpt3'

const InputMessage = ({ input, setInput, sendMessage, regenerateResponse, placeholder }: any) => {
  // remove newline in tail of message
  input = input.replace(/^\n|\n$/g, '')
  return (
    <div className="mt-6 flex clear-both">
      <textarea
        spellCheck="true"
        placeholder={placeholder}
        rows={2}
        aria-label="chat input"
        required
        className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
        value={input}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(input)
            setInput('')
          }
        }}
        onChange={(e) => {
          setInput(e.target.value)
        }}
      />
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="ml-4 flex-none"
          onClick={() => {
            sendMessage(input)
            setInput('')
          }}
        >
          Send
        </Button>
        <Button
          type="submit"
          className="ml-4 flex-none"
          onClick={() => {
            regenerateResponse()
          }}
        >
          Regenerate
        </Button>
      </div>

    </div>
  )
}

const updateMessgeByWebSearch = async (message: string, pluginConfig: PluginConfig) => {
    // regrex match to get words encloused with #, e.g. ##hello##world## => [hello, world]
    const regrex = /##([^#]+)##/g
    const match = message.match(regrex)
    if (match) {
      for (const word of match) {
        const webSearchResp = await webSearch(word.slice(2,-2), pluginConfig.searchResultNum, pluginConfig.searchEngine)
        if (webSearchResp.ok) {
          const webSearchResult = webSearchResp.data
          message = message.replace(word, `\n${webSearchResult}\n`)
        }
      }
    } else {
      const webSearchResp = await webSearch(message, pluginConfig.searchResultNum, pluginConfig.searchEngine)
      if (webSearchResp.ok) {
        const webSearchResult = webSearchResp.data
        const currentDate = new Date().toLocaleDateString()
        message = webSearchPromopt
          .replace("{web_results}", webSearchResult)
          .replace("{current_date}", currentDate)
          .replace("{query}", message)
      }
    }
    return message
}

export function Chat() {
  const { sessionList, setSessionList, curSessionIdx, setCurSessionIdx, pluginConfig } = useContext(ConversationContext)

  let session = sessionList[curSessionIdx] as ConversationInf
  const sessionCnt = sessionList.length;
  if (curSessionIdx >= sessionCnt) {
    console.error(`Wrong curSessionIdx ${curSessionIdx} >= sessionCnt ${sessionCnt}`)
  }
  const messages = session?.contents
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState('')
  const [cookie, setCookie] = useCookies([COOKIE_NAME])
  const bottomRef = useRef<HTMLDivElement|null>(null)

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  useEffect(() => {
    // scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'auto'});
  }, [messages, loading]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    if (message === '' || loading !== '') {
      return
    }
    if (pluginConfig.useSearch) {
      message = await updateMessgeByWebSearch(message, pluginConfig)
    }
    setLoading('Loading...')
    const newMessages = [
      ...messages,
      { role: 'user', content: message } as ChatGPTMessage,
    ]
    if (curSessionIdx == 0) {
      const uniqueId = Math.random().toString(36)
      const newSession = {title: "Session", uniqueId, createTime: Date.now(), contents: newMessages}
      setSessionList({type: 'add', payload: newSession})
      setCurSessionIdx(sessionCnt)
      session = newSession
    } else {
      session.contents = newMessages
      setSessionList({type: 'modify', payload: session})
    }

    const last10messages = newMessages.slice(-10) // remember last 10 messages
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    })

    console.log('Edge function returned.')

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let returnMessage = ''

    setLoading('')
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      returnMessage = returnMessage + chunkValue

      if (response.ok) {
        session.contents = [
          ...newMessages,
          { role: 'assistant', content: returnMessage } as ChatGPTMessage,
        ]
        if (done) {
          setSessionList({type: 'modify', payload: session})
        } else {
          setSessionList({type: 'responding', payload: session})
        }
      }
    }
    if (!response.ok) {
      toast.error(returnMessage)
    }
  }

  const regenerateResponse = async () => {
    if (loading !== '' || messages.length < 2 || messages[messages.length - 1]?.role !== 'assistant') {
      return
    }
    setLoading('Regenerating...')
    // remove last message
    const newMessages = messages.slice(0, -1)
    session.contents = newMessages
    setSessionList({type: 'modify', payload: session})
    const last10messages = newMessages.slice(-10) // remember last 10 messages

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    })

    console.log('Edge function returned.')

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    let returnMessage = ''

    setLoading('')
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      returnMessage = returnMessage + chunkValue

      if (response.ok) {
        session.contents = [
          ...newMessages,
          { role: 'assistant', content: returnMessage } as ChatGPTMessage,
        ]
        if (done) {
          setSessionList({type: 'modify', payload: session})
        } else {
          setSessionList({type: 'responding', payload: session})
        }
      }
    }
    if (!response.ok) {
      toast.error(returnMessage)
    }
  }

  const getPlaceHolder = ()=>{
    if (pluginConfig.useSearch) {
      return "Search input message and include the search results in default prompt.\nYou can also set your own prompt using ##...## to enclose the search keyword."
    } else {
      return "Type a message to start the conversation..."
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden transition-width flex flex-col flex-1 items-center pb-28">
      <div className="flex flex-1 w-full overflow-y-auto justify-center">
        <div className="w-full lg:max-w-3xl p-3 md:h-full md:flex md:flex-col">
          {messages?.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}
          {messages?.length < 1 && (
            <span className="mx-auto flex flex-grow text-gray-600 clear-both">
              Type a message to start the conversation
            </span>
          )}
          {loading && <LoadingChatLine loadingMsg={loading}/>}
          <div className="w-full float-left clear-both" ref={bottomRef}></div>
        </div>
      </div>
      {messages && <div className="absolute bottom-0 w-full p-3 lg:max-w-3xl">
        <InputMessage
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            regenerateResponse={regenerateResponse}
            placeholder={getPlaceHolder()}
          />
      </div>}
    </div>
  )
}

import React, {useReducer} from "react";
import { getAllSaveSessions, saveCurrentSessionThrottle } from './SessionStorage';

import { Chat } from './ChatBox'
import { ConversationContext } from './Conversations';
import { ConversationInf } from '../utils/Message';
import { SideBar } from './SideBar'

function sessionReducer(sessionList: ConversationInf[], action: {type: string, payload: ConversationInf}) {
    switch (action.type) {
      case 'add':
        return [...sessionList, action.payload];
      case 'delete':
        // remove the element with uniqueId
        return sessionList.filter((e: ConversationInf) => e.uniqueId !== action.payload.uniqueId);
      case 'modify':
        // modify the element with uniqueId
        return sessionList.map((e: ConversationInf) => { 
          if (e.uniqueId === action.payload.uniqueId) {
            saveCurrentSessionThrottle(action.payload)
            return action.payload
          } else {
            return e
          }
        })
      default:
          throw new Error();
  }
}

function curIdxReducer(state:number, newIndex: number) {
  return newIndex;
}

export function MainFrame() {
  const defaultSessions: ConversationInf[] = [{title: "Default", uniqueId:"Default", contents:[]}]
  const [sessionList, setSessionList] = useReducer(sessionReducer, [], ()=> {
    const savedSessions = getAllSaveSessions()
    return savedSessions ? [...defaultSessions, ...savedSessions] : defaultSessions
  })

  const [curSessionIdx, setCurSessionIdx] = useReducer(curIdxReducer, 0)
  return (    
    <div className="overflow-hidden w-full h-screen relative">
        <ConversationContext.Provider value={{sessionList, setSessionList, curSessionIdx, setCurSessionIdx}}>
          <div className="flex h-full flex-1 flex-col md:pl-[260px]">
              <Chat />
          </div>
          <SideBar/>
        </ConversationContext.Provider>
    </div>
  )
}

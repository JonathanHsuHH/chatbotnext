import React, {useEffect, useReducer} from "react";
import { getAllSaveSessions, saveCurrentSessionThrottle } from './SessionStorageServer';

import { Chat } from './ChatBox'
import { ConversationContext } from './Conversations';
import { ConversationInf } from '../utils/Message';
import { SideBar } from './SideBar'
import { Toaster } from 'react-hot-toast';

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
      case 'responding':
        // modify the element with uniqueId
        return sessionList.map((e: ConversationInf) => { 
          if (e.uniqueId === action.payload.uniqueId) {
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
  const defaultSessions: ConversationInf[] = [{title: "Default", uniqueId:"Default", createTime: Date.now(), contents:[]}]

  const [sessionList, setSessionList] = useReducer(sessionReducer, defaultSessions)

  useEffect(() => {
    getAllSaveSessions().then((resp) => {
      // if savedSession is array and not empty
      if (Array.isArray(resp?.sessions) && resp.sessions.length) {
        resp.sessions.forEach((session: any) => {
          setSessionList({type: 'add', payload: session})
        })
      }
    });
  }, []); // The empty array causes this effect to only run on mount
  
  const [curSessionIdx, setCurSessionIdx] = useReducer(curIdxReducer, 0)
  return (    
    <div className="overflow-hidden w-full h-screen relative">
        <ConversationContext.Provider value={{sessionList, setSessionList, curSessionIdx, setCurSessionIdx}}>
          <div className="flex h-full flex-1 flex-col md:pl-[260px]">
              <Chat />
          </div>
          <div><Toaster/></div>
          <SideBar/>
        </ConversationContext.Provider>
    </div>
  )
}

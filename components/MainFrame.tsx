import { PluginConfig, SearchEngineEnum } from '../utils/Plugin';
import React, {useEffect, useReducer} from "react";
import { getAllSaveSessions, saveCurrentSessionThrottle } from '../utils/SessionStorageServer';

import { Chat } from './ChatBox'
import { ConversationContext } from './Context';
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

function pluginCfgReducer(state:PluginConfig, newConfig: PluginConfig) {
  return newConfig;
}

export function MainFrame() {
  const defaultSessions: ConversationInf[] = [{title: "Default", uniqueId:"Default", createTime: Date.now(), contents:[]}]

  const [sessionList, setSessionList] = useReducer(sessionReducer, defaultSessions)

  useEffect(() => {
    getAllSaveSessions().then((resp) => {
      // if savedSession is array and not empty
      if (Array.isArray(resp?.sessions) && resp.sessions.length) {
        for (var i = resp.sessions.length - 1; i >= 0; i--) {
          setSessionList({type: 'add', payload: resp.sessions[i]})
        }
      }
    });
  }, []); // The empty array causes this effect to only run on mount
  
  const [curSessionIdx, setCurSessionIdx] = useReducer(curIdxReducer, 0)

  const defaultPluginConfig: PluginConfig = {usePromptSuggestion: false, useSearch: false, searchEngine: SearchEngineEnum.Bing, searchResultNum: 3/*, useGPT4: false*/}
  const [pluginConfig, setPluginConfig] = useReducer(pluginCfgReducer, defaultPluginConfig)
  return (    
    <div className="overflow-hidden w-full h-screen relative text-sm">
        <ConversationContext.Provider value={{sessionList, setSessionList, curSessionIdx, setCurSessionIdx, pluginConfig, setPluginConfig}}>
          <div className="flex h-full flex-1 flex-col md:pl-[230px]">
              <Chat />
          </div>
          <div><Toaster position='top-right'/></div>
          <SideBar/>
        </ConversationContext.Provider>
    </div>
  )
}

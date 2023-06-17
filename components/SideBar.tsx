import { BiAperture, BiCheck, BiEdit, BiMessage, BiMinusCircle, BiPlusCircle, BiX } from "react-icons/bi";
import { removeCurrentSession, saveCurrentSession } from '../utils/SessionStorageServer';
import { useContext, useState } from 'react';

import { ConversationContext } from './Context';
import { ConversationInf } from '../utils/Message';
import EdiText from 'react-editext'
import { logout } from "../utils/LoginUtils";
import styled from 'styled-components';
import tw from "tailwind-styled-components";
import { useRouter } from 'next/router';

const StyledEdiText = styled(EdiText)`
  button[editext="edit-button"] {
    display: none;
  }
  button[editext="save-button"] {
    padding:0;
    min-width:0;
  }
  button[editext="cancel-button"] {
    padding:0;
    min-width:0;
  }
  input, textarea {
    background: #1F2937;
    padding:0 0 0 5px;
  }
  div[editext="view-container"] {
    display: flex;
    border-radius: 5px;
    color: #fff;
}
`

export function SideBar() {
    const router = useRouter();
    const { sessionList, setSessionList, curSessionIdx, setCurSessionIdx, pluginConfig, setPluginConfig } = useContext(ConversationContext)
    const [ editing, setEditing ] = useState(false)
    const onConversationSelect = (index: number) => {
      setCurSessionIdx(index);
    };
  
    //remove index element from conversations
    const onConversationRemove = (index: number) => {
      setCurSessionIdx(0)
      const uniqueId = sessionList.map((e: ConversationInf) => e.uniqueId)[index]
      setSessionList({type: 'delete', payload: {title: "", uniqueId, contents: []}})
      removeCurrentSession(uniqueId);
    };

    const onConversationEdit = (title: string, index: number) => { 
      const session = sessionList[index] as ConversationInf
      session.title = title
      setSessionList({type: 'modify', payload: session})
      // edit session in server storage
      saveCurrentSession(session)
    };

    const onNewConversation = () => {
        console.log("Creating a new conversation...")
        const uniqueId = Math.random().toString(36)
        const lastIdx = sessionList.length
        setSessionList({type: 'add', payload: {title: "Session", uniqueId, createTime: Date.now(), contents: []}})
        setCurSessionIdx(lastIdx)
      };

    return (
      <Container>
        <LogoContainer>
          <BiAperture size={48} 
            //onClick={()=>{logout(); router.push('/login');}}
          />
        </LogoContainer>
        <HeaderContainer onClick={onNewConversation}>
          <BiPlusCircle size={16} />
          <span>New conversation</span>
        </HeaderContainer>
        <SessionContainer>
          {sessionList.slice(1).map((conversation: ConversationInf, index: number) => (
            <ItemContainer key={index} selected={index + 1 === curSessionIdx} onClick={() => onConversationSelect(index + 1)}>
              <SessionPart>
                {(!editing || index + 1 !== curSessionIdx) && <BiMessage size={16} />}
                <ConversationItem>
                  <StyledEdiText
                    type='text'
                    value={conversation.title}
                    onSave={(val) => {
                      onConversationEdit(val, index + 1) 
                      setEditing(false)}
                    }
                    hideIcons={true}
                    editing={editing && index + 1 === curSessionIdx}
                    editButtonContent={''}
                    saveButtonContent = {<BiCheck size={16}/>}
                    cancelButtonContent = {<BiX size={16}/>}
                    onEditingStart = {()=>setEditing(true)}
                    onCancel = {()=>setEditing(false)}
                  />
                </ConversationItem>
              </SessionPart>
              {!editing && index + 1 === curSessionIdx && <SessionPart>
                <IconContainer>
                  <BiEdit size={16} onClick={() => setEditing(true)} />
                </IconContainer>
                <IconContainer>
                  <BiMinusCircle size={16} onClick={(e) => {onConversationRemove(index + 1); e.stopPropagation();}} />
                </IconContainer>
              </SessionPart>}
            </ItemContainer>
          ))}
        </SessionContainer>
        <PluginContainer>
          <WebSearchPluginContainer>
          <label className="relative inline-flex items-center cursor-pointer justify-between">
              <span className="mr-3 text-sm">Prompt suggestion</span>
              <input type="checkbox" 
                defaultChecked={pluginConfig.usePromptSuggestion} 
                onChange={()=>{setPluginConfig({...pluginConfig, usePromptSuggestion: !pluginConfig.usePromptSuggestion})}}
                className="sr-only peer"/>
              <div className="w-10 h-5 bg-gray-200 
              peer-focus:outline-none 
              peer-focus:ring-4 
              peer-focus:ring-blue-300 rounded-full
              peer-checked:after:translate-x-full
              peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] 
              after:right-[20px] after:bg-white after:border-gray-300 
              after:border after:rounded-full after:h-4 after:w-4 
              after:transition-all peer-checked:bg-blue"></div>
            </label>
            <label className="relative inline-flex items-center cursor-pointer justify-between">
              <span className="mr-3 text-sm">Web search</span>
              <input type="checkbox" 
                defaultChecked={pluginConfig.useSearch} 
                onChange={()=>{setPluginConfig({...pluginConfig, useSearch: !pluginConfig.useSearch})}}
                className="sr-only peer"/>
              <div className="w-10 h-5 bg-gray-200 
              peer-focus:outline-none 
              peer-focus:ring-4 
              peer-focus:ring-blue-300 rounded-full
              peer-checked:after:translate-x-full
              peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] 
              after:right-[20px] after:bg-white after:border-gray-300 
              after:border after:rounded-full after:h-4 after:w-4 
              after:transition-all peer-checked:bg-blue"></div>
            </label>
            {pluginConfig.useSearch && <label className="relative inline-flex items-center cursor-pointer justify-between">
              <span className="mr-3 text-sm w-60">Result number :</span>
              <SelectBox value={pluginConfig.searchResultNum} onChange={e => setPluginConfig({...pluginConfig, searchResultNum: e.target.value})}>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </SelectBox>
            </label>}
            {pluginConfig.useSearch && <label className="relative inline-flex items-center cursor-pointer justify-between">
              <span className="mr-3 text-sm w-60">Search engine :</span>
              <SelectBox value={pluginConfig.searchEngine} onChange={e => setPluginConfig({...pluginConfig,  searchEngine: e.target.value})}>
                <option value="Google">Google</option>
                <option value="Bing">Bing</option>
              </SelectBox>
            </label>}
          </WebSearchPluginContainer>
        </PluginContainer>
      </Container>
    )
}

const SwitchButton = tw.label`
  relative inline-flex items-center cursor-pointer
`;

const SelectBox = tw.select`
  bg-gray-50 border border-gray-300 text-gray-600 text-sm block w-full rounded-md w-40
`;

const Container = tw.div`
  hidden bg-gray-800 text-gray-300 md:fixed md:inset-y-0 md:flex md:w-[230px] md:flex-col p-2 gap-3
`;

const LogoContainer = tw.div`
  px-3 py-3 flex justify-center
`;

const IconContainer = tw.div`
  flex items-center
`;

const SessionContainer = tw.div`
  flex flex-col gap-3
  h-1/2 no-scrollbar overflow-y-auto scroll-shadows max-h-[50%]
`;

const ItemContainer = tw.div<{ selected: boolean }>`
  px-3 py-3
  flex justify-between items-center gap-3
  border-white rounded-md
  hover:bg-gray-500 hover:text-white cursor-pointer
  ${(props: { selected: any; }) =>
    props.selected
      ? "font-medium text-white bg-gray-500"
      : "font-normal"}`
;

const HeaderContainer = tw.div`
  px-3 py-3
  flex items-center  gap-3
  border border-white rounded-md
  hover:bg-gray-500 transition-colors duration-200 cursor-pointer
`;

const PluginContainer = tw.div`
  flex flex-col gap-3 px-3 py-3
  no-scrollbar overflow-y-auto max-h-[40%]
  border-t border-white border-opacity-50
`;

const WebSearchPluginContainer = tw.div`
  flex flex-col gap-3 
`;

const SessionPart = tw.button`
  flex flex-row gap-3 items-center
`;

const ConversationItem = tw.button`
  flex items-center text-left focus:outline-none truncate
`;
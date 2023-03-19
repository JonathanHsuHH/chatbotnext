import { BiAperture, BiCheck, BiEdit, BiMessage, BiMinusCircle, BiPlusCircle, BiX } from "react-icons/bi";
import { removeCurrentSession, saveCurrentSession } from './SessionStorageServer';
import { useContext, useState } from 'react'

import { ConversationContext } from './Conversations';
import { ConversationInf } from '../utils/Message';
import EdiText from 'react-editext'
import styled from 'styled-components';
import tw from "tailwind-styled-components";

// import { addToGptSessionList } from './SessionStorage';

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
    const { sessionList, setSessionList, curSessionIdx, setCurSessionIdx } = useContext(ConversationContext)
    const [ editing, setEditing ] = useState(false)
    const onConversationSelect = (index: number) => {
      setCurSessionIdx(index);
    };
  
    //remove index element from conversations
    const onConversationRemove = (index: number) => {
      setCurSessionIdx(0)
      const uniqueId = sessionList.map((e: ConversationInf) => e.uniqueId)[index]
      setSessionList({type: 'delete', payload: {title: "", uniqueId, contents: []}})

      removeCurrentSession(uniqueId)
    };

    const onConversationEdit = (title: string, index: number) => { 
      const session = sessionList[index] as ConversationInf
      session.title = title
      setSessionList({type: 'modify', payload: session})
      // edit session in server storage
      saveCurrentSession(session)
    };

    const onNewConversation = () => {
        // save current session to server storage
        if (curSessionIdx > 0) {
          console.log("Save current session to server storage...")
          saveCurrentSession(sessionList[curSessionIdx])
        }
        console.log("Creating a new conversation...")
        const uniqueId = Math.random().toString(36)
        setSessionList({type: 'add', payload: {title: "Session", uniqueId, createTime: Date.now(), contents: []}})
        setCurSessionIdx(curSessionIdx + 1)

        // add new session id to gptSessionList
        // addToGptSessionList(uniqueId)
      };

    return (
      <Container>
        <LogoContainer>
          <BiAperture size={48} />
        </LogoContainer>
        <HeaderContainer onClick={onNewConversation}>
          <BiPlusCircle size={16} />
          <span>New conversation</span>
        </HeaderContainer>
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
      </Container>
    )
}

const Container = tw.div`
  hidden bg-gray-800 text-gray-300 md:fixed md:inset-y-0 md:flex md:w-[230px] md:flex-col p-2 gap-3
`;

const LogoContainer = tw.div`
  px-3
  py-3
  flex
  justify-center
`;

const IconContainer = tw.div`
  flex
  items-center
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

const SessionPart = tw.button`
  flex
  flex-row
  gap-3
  items-center
`;

const ConversationItem = tw.button`
  flex
  items-center
  text-left
  focus:outline-none
  truncate
`;
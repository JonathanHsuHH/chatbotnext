import { ConversationInf } from './Message'
import { getCurrentUser } from './LoginUtils'
import {postWrapper} from '../utils/api/fetchWrapper';
import toast from 'react-hot-toast'

var bRedisInServer = false;
export async function getAllSaveSessions()
{
    const userId = getCurrentUser();
    const response = await postWrapper('/api/getAllSessions', JSON.stringify({userId}));
    if (response.ok) {
        bRedisInServer = true
        return await response.json()
    } else {
        toast.error(`Fail to get history sessions: ${response.status} ${response.statusText}`)
    }
}

export async function saveCurrentSession(curSession: ConversationInf)
{
    if (!bRedisInServer) {
        return
    }
    const userId = getCurrentUser();
    const res = await postWrapper('/api/updateSession', JSON.stringify({...curSession, userId}));
    const { error } = await res.json()
    if (error) {
      toast.error((`Fail to save current session: ${error}`))
    }
}


export function saveCurrentSessionThrottle(curSession: ConversationInf)
{
    if (!bRedisInServer) {
        return
    }
    if(curSession && curSession.contents.length > 0) {
        saveCurrentSession(curSession)
    }
}

export async function removeCurrentSession(uniqueId: string)
{
    if (!bRedisInServer) {
        return
    }
    const userId = getCurrentUser();
    const res = await postWrapper('/api/deleteSession', JSON.stringify({uniqueId, userId}));
    const { error } = await res.json()
    if (error) {
        toast.error((`Fail to delete session: ${error}`))
    }
}
import { ConversationInf } from '../utils/Message'
import toast from 'react-hot-toast'

export async function getAllSaveSessions()
{
    const response = await fetch('/api/getAllSessions', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
    })
    if (response.ok) {
        return await response.json()
    } else {
        toast.error(`Fail to get history sessions: ${response.status} ${response.statusText}`)
    }
}

export async function saveCurrentSession(curSession: ConversationInf)
{
    if (!process.env.REDIS_URL) {
        return
    }
    const res = await fetch('/api/updateSession', {
        body: JSON.stringify(curSession),
        headers: {
        'Content-Type': 'application/json',
        },
        method: 'POST',
        }
    )
    const { error } = await res.json()
    if (error) {
      toast.error((`Fail to save current session: ${error}`))
    }
}


export function saveCurrentSessionThrottle(curSession: ConversationInf)
{
    if (!process.env.REDIS_URL) {
        return
    }
    if(curSession && curSession.contents.length > 0) {
        saveCurrentSession(curSession)
    }
}

export async function removeCurrentSession(uniqueId: string)
{
    if (!process.env.REDIS_URL) {
        return
    }
    const res = await fetch('/api/deleteSession', {
        body: JSON.stringify({uniqueId}),
        headers: {
        'Content-Type': 'application/json',
        },
        method: 'POST',
        }
    )
    const { error } = await res.json()
    if (error) {
        toast.error((`Fail to delete session: ${error}`))
    }
}
import { ConversationInf } from '../utils/Message';

// ToDo, use server storage instead of local storage

// save current session to local storage, when the number of messages is a multiple of 4
export function saveCurrentSessionThrottle(curSession: ConversationInf)
{
    if(curSession && curSession.contents.length % 4 == 0) {
        saveCurrentSession(curSession)
    }
}

// save current session to local storage
export function saveCurrentSession(curSession: ConversationInf)
{
    return null;
    /*
    try {
        const uniqueId = curSession.uniqueId
        const savedSession = localStorage.getItem(`session_${uniqueId}`)
        if (!savedSession) {
            addToGptSessionList(uniqueId)
        }
        localStorage.setItem(`session_${uniqueId}`, JSON.stringify(curSession))
    } catch (e) {
        console.log(e)
    }
    */
}

// remove current session to local storage, when the number of messages is a multiple of 10
export function removeCurrentSession(uniqueId: string)
{
    return null;
    /*
    // remove unique id from gptSessionList local storage
    try {
        const gptSessionList = localStorage.getItem("gptSessionList")
        if (gptSessionList) {
            JSON.parse(gptSessionList).remove(uniqueId)
            localStorage.setItem("gptSessionList", JSON.stringify(gptSessionList))
        }
        // remove current session from local storage
        localStorage.removeItem(`session_${uniqueId}`)
    } catch (e) {
        console.log(e)
    }
    */
}

export function addToGptSessionList(uniqueId: string)
{
    return null;
    /*
    // add unique id to gptSessionList local storage
    try {
        const gptSessionList = localStorage.getItem("gptSessionList")
        if (gptSessionList) {
          JSON.parse(gptSessionList).add(uniqueId)
          localStorage.setItem("gptSessionList", JSON.stringify(gptSessionList))
        } else {
          localStorage.setItem("gptSessionList", JSON.stringify([uniqueId]))
        }
      } catch (e) {
        console.log(e)
      }
    */
}

export function getAllSaveSessions()
{
    return null;
    /*
    // get all saved session from local storage
    try {
        const gptSessionList = localStorage.getItem("gptSessionList")
        if (gptSessionList) {
            const sessionList = JSON.parse(gptSessionList).map((uniqueId: string) => {
                const savedSession = localStorage.getItem(`session_${uniqueId}`)
                if (savedSession) {
                    return JSON.parse(savedSession)
                }
            })
            return sessionList
        }
    } catch (e) {
        console.log(e)
    }
    return null
    */
}
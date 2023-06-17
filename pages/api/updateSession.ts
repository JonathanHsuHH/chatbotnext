import type { NextApiRequest, NextApiResponse } from 'next'

import { apiHandler } from '../../utils/api';
import redis from '../../lib/redis'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uniqueId, userId } = req.body

  if (!uniqueId) {
    res.status(400).json({
      error: 'Session can not be empty',
    })
  } else {
    const session = await redis.hget('chatSessions', uniqueId);
    if (session) {
      const sessionObj = JSON.parse(session)
      if (sessionObj.userId !== userId) {
        res.status(400).json({
          error: 'You are not the owner of this session',
        })
        return;
      }
    }
    await redis.hset('chatSessions', uniqueId, JSON.stringify(req.body))
    res.status(200).json({
      body: 'success',
    })
  }
}

export default apiHandler(handler);
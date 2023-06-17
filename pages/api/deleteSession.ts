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
        error: 'Id can not be empty',
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
        await redis.hdel('chatSessions', uniqueId)
        res.status(200).json({
          body: 'success',
        })
      } else {
        res.status(400).json({
          error: 'Id not exists',
        })
      }
    }
  }

export default apiHandler(handler);
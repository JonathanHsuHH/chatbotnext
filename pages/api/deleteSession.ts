import type { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../lib/redis'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { uniqueId } = req.body
  
    if (!uniqueId) {
      res.status(400).json({
        error: 'Id can not be empty',
      })
    } else {
      await redis.hdel('chatSessions', uniqueId)
      res.status(200).json({
        body: 'success',
      })
    }
  }
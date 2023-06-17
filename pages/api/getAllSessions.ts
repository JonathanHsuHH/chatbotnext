import type { NextApiRequest, NextApiResponse } from 'next'

import { apiHandler } from '../../utils/api';
import redis from '../../lib/redis'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {     
  const { userId } = req.body
  const sessions = (await redis.hvals('chatSessions'))
    .map((entry) => JSON.parse(entry))
    .filter((session) => session.userId === userId)
    .sort((a, b) => b.createTime - a.createTime)

  res.status(200).json({ sessions })
}

export default apiHandler(handler);
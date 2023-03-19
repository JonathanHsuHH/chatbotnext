import type { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {     
  const sessions = (await redis.hvals('chatSessions'))
    .map((entry) => JSON.parse(entry))
    .sort((a, b) => b.createTime - a.createTime)

  res.status(200).json({ sessions })
}
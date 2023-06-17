import type { NextApiRequest, NextApiResponse } from 'next'

import { apiHandler } from '../../utils/api';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryText, resultNum } = req.body
  const data = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${queryText}&count=${resultNum}`,
    {headers: {
        'Ocp-Apim-Subscription-Key': `${process.env.BING_SEARCH_V7_SUBSCRIPTION_KEY}`
    }}
  ).then((response) => response.json());
  res.status(200).json({ data })
}

export default apiHandler(handler);
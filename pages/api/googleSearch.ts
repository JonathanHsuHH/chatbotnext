import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryText, resultNum } = req.body
  const data = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_CONTENXT_KEY}&q=${queryText}&num=${resultNum}`
  ).then((response) => response.json());
  res.status(200).json({ data })
}
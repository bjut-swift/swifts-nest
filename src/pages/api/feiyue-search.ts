import { NextApiRequest, NextApiResponse } from 'next';

import { getSearchIndex } from '@/lib/feiyue.server';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const index = await getSearchIndex();
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json(index);
}

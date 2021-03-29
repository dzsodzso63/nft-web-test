import { NextApiRequest, NextApiResponse } from 'next';
import { putItem } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  
  if (body && body.item) {
    return res.status(200).json({ result: (await putItem(body.item) as any) });
  }
  res.status(400).json({ msg: 'problemo' })
}

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Missing name or type' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  const blob = await put(name, Buffer.from(''), {
    access: 'public',
    contentType: type,
    token
  });

  return res.status(200).json({ url: blob.url });
}
export const config = {
    api: {
      bodyParser: true, // default; but can be made explicit
    },
  };
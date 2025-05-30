import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, type } = req.body;

  const token = process.env.BLOB_READ_WRITE_TOKEN; // ✅ Server-side ONLY
  if (!token) return res.status(500).json({ error: 'Missing token' });

  const blob = await put(name, Buffer.from(''), {
    access: 'public',
    contentType: type,
    token
  });

  res.status(200).json({ url: blob.url });
}
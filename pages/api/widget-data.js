import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,         // ✅ no NEXT_PUBLIC here
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { siteId, elementId } = req.query;

  if (!siteId || !elementId) {
    return res.status(400).json({ error: 'Missing siteId or elementId' });
  }

  const { data, error } = await supabase
    .from('widget_settings')
    .select('*')
    .eq('site_id', siteId)
    .eq('element_id', elementId)
    .limit(1)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data); // only expose safe fields
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function WidgetSettings() {
  const [imageUrl, setImageUrl] = useState('');
  const [copyright, setCopyright] = useState('');
  const [credit, setCredit] = useState('');
  const [siteId, setSiteId] = useState('');
  const [elementId, setElementId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const site = urlParams.get('siteId');
    const element = urlParams.get('elementId');
    setSiteId(site);
    setElementId(element);

    if (site && element) {
      supabase
        .from('widget_settings')
        .select('*')
        .eq('site_id', site)
        .eq('element_id', element)
        .single()
        .then(({ data }) => {
          if (data) {
            setImageUrl(data.image_url || '');
            setCopyright(data.copyright || '');
            setCredit(data.credit || '');
          }
        });
    }
  }, []);

  const saveSettings = async () => {
    await supabase.from('widget_settings').upsert({
      site_id: siteId,
      element_id: elementId,
      image_url: imageUrl,
      copyright,
      credit
    });
    alert('Saved!');
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Widget Settings</h2>

      <label>Image URL</label><br />
      <input style={{ width: '100%' }} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /><br /><br />

      <label>Copyright Notice</label><br />
      <input style={{ width: '100%' }} value={copyright} onChange={(e) => setCopyright(e.target.value)} /><br /><br />

      <label>Credit Line</label><br />
      <input style={{ width: '100%' }} value={credit} onChange={(e) => setCredit(e.target.value)} /><br /><br />

      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
}
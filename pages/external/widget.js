import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { put } from '@vercel/blob';

let siteid_for_image_upload = 'ef1c0c13';

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

  useEffect(()=>{
    fetch('/api/sites')
    .then(res => res.json())
    .then(data => console.log(data));
  },[])

  const handleFileUpload = async (file) => {
    if (!file) return;
  
    try {
      // Step 1: Ask your API route to generate a Blob URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: file.type
        })
      });
  
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
  
      const { url } = await res.json();
  
      // Step 2: Upload the file's contents to the Blob URL
      await fetch(url, {
        method: 'PUT',
        body: file
      });
  
      // Step 3: Save the uploaded URL to state
      setImageUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };


  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Widget Settings</h2>

      <label>Image URL</label><br />
      <input style={{ width: '100%' }} className="inputfield" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /><br /><br />
      <input type="file" accept="image/*"  onChange={(e) => handleFileUpload(e.target.files[0])} /><br /><br />
      <label>Copyright Notice:</label><br />
      <input style={{ width: '100%' }} className="inputfield" value={copyright} onChange={(e) => setCopyright(e.target.value)} /><br /><br />

      <label>Credit Line</label><br />
      <input style={{ width: '100%' }} className="inputfield" value={credit} onChange={(e) => setCredit(e.target.value)} /><br /><br />

      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
}
// pages/api/sites.js
/*
export default async function handler(req, res) {
    const uname = process.env.DUDA_API_USERNAME;
    const pass = process.env.DUDA_API_PASSWORD;
    const credentials = Buffer.from(`${uname}:${pass}`).toString('base64');
  
    const response = await fetch('https://api.duda.co/api/sites/multiscreen?offset=0&limit=75&sort=CREATION_DATE&direction=DESC', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${credentials}`
      }
    });
  
    const data = await response.json();
    res.status(200).json(data);
  }*/
  export default async function handler(req, res) {
    const uname = process.env.DUDA_API_USERNAME;
    const pass = process.env.DUDA_API_PASSWORD;
  
    if (!uname || !pass) {
      console.error('Missing Duda credentials');
      return res.status(500).json({ error: 'Missing Duda credentials' });
    }
  
    const credentials = Buffer.from(`${uname}:${pass}`).toString('base64');
  
    try {
      const response = await fetch('https://api.duda.co/api/sites/multiscreen?offset=0&limit=75&sort=CREATION_DATE&direction=DESC', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Basic ${credentials}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // fallback for bad JSON
        console.error('Duda API Error:', errorText);
        return res.status(response.status).json({ error: 'Duda API request failed', details: errorText });
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error('Unexpected server error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
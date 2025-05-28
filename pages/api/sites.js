// pages/api/sites.js
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
  }
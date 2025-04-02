// api/content.js
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // Handle OPTIONS (preflight) requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    try {
      const backendResponse = await fetch('https://socio-99.onrender.com/api/content', {
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!backendResponse.ok) {
        throw new Error(`Backend responded with ${backendResponse.status}`);
      }
  
      const data = await backendResponse.json();
      return res.status(200).json(data);
      
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch content',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
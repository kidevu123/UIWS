import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  try {
    if (method === 'GET') {
      // Get messages
      const { limit, offset } = req.query;
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit as string);
      if (offset) queryParams.append('offset', offset as string);
      
      const r = await fetch(`http://gateway:4000/chat/messages?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || ''
        }
      });
      
      if (r.status === 401) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const data = await r.json();
      res.status(r.status).json(data);
      
    } else if (method === 'POST') {
      // Send message
      const r = await fetch("http://gateway:4000/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cookie': req.headers.cookie || ''
        },
        body: JSON.stringify(req.body || {})
      });
      
      if (r.status === 401) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const data = await r.json();
      res.status(r.status).json(data);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Chat messages API error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  try {
    if (method === 'GET') {
      // Get appointments
      const response = await fetch('http://gateway:4000/appointments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || ''
        }
      });
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const data = await response.json();
      res.status(response.status).json(data);
      
    } else if (method === 'POST') {
      // Create appointment
      const response = await fetch('http://gateway:4000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || ''
        },
        body: JSON.stringify(req.body || {})
      });
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const data = await response.json();
      res.status(response.status).json(data);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Appointments API error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
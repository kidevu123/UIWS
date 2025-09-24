import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = await fetch("http://gateway:4000/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Cookie': req.headers.cookie || ''
      }
    });
    
    if (r.status === 401) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    console.error('Me API error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

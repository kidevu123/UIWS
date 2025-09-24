import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, remember } = req.body || {};
    
    const r = await fetch("http://gateway:4000/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });
    
    if (r.ok) {
      const data = await r.json();
      
      // Set JWT cookie if login successful
      if (data.token) {
        // Different cookie durations based on "Remember me"
        const maxAge = remember ? 30 * 24 * 60 * 60 : 0; // 30 days or session cookie
        const maxAgeString = remember ? `; Max-Age=${maxAge}` : '';
        
        res.setHeader('Set-Cookie', [
          `uiw_jwt=${data.token}; HttpOnly; Path=/; SameSite=Strict${maxAgeString}`
        ]);
      }
      
      res.status(200).json(data);
    } else {
      const errorData = await r.text();
      res.status(r.status).send(errorData);
    }
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ message: "Authentication service unavailable" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = await fetch("http://gateway:4000/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(req.body || {})
    });
    
    if (r.ok) {
      const data = await r.json();
      
      // Set JWT cookie if login successful
      if (data.token) {
        res.setHeader('Set-Cookie', [
          `uiw_jwt=${data.token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
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

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch("http://gateway:4000/settings/onboarding/complete", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(req.body || {})
  });
  const text = await r.text();
  res.status(r.status).send(text);
}

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch("http://gateway:4000/auth/me");
  const text = await r.text();
  res.status(r.status).send(text);
}

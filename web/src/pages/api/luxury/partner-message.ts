import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch("http://gateway:4000/luxury/partner-message", {
    method: "POST",
    body: (req as any).body || undefined,
    headers: req.headers as any
  });
  const buf = await r.arrayBuffer();
  res.status(r.status).send(Buffer.from(buf));
}

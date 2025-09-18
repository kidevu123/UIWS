import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch("http://gateway:4000/settings/settings");
  const text = await r.text();
  res.status(r.status).send(text);
}

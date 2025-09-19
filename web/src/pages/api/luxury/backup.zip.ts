import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const r = await fetch("http://gateway:4000/luxury/backup.zip");
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=uiw-backup.zip");
  const buf = await r.arrayBuffer();
  res.status(200).send(Buffer.from(buf));
}

// pages/api/frame.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "FarGuard Miniapp is live" });
}

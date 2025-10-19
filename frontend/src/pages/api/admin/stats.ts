import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    total_premium: 0,
    total_policy: 0,
    total_commission: 0
  });
}

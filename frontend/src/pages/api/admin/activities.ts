import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Henüz backend bağlantısı olmadığı için boş liste dönüyoruz
  const activities: any[] = [];
  
  res.status(200).json(activities);
}

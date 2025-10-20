import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gerçek poliçe verilerinden aktiviteler oluştur
  const activities = policies
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 20) // Son 20 aktivite
    .map((policy) => ({
      id: policy.id,
      type: `${policy.policyType} Poliçesi`,
      company: policy.company,
      user: policy.userName,
      price: policy.amount,
      plate: policy.policyDetails?.plaka || null,
      time: policy.createdAt,
      status: policy.status === "active" ? "success" : "pending",
    }));

  res.status(200).json(activities);
}

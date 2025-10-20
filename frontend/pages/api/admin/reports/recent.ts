import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gerçek poliçe verilerinden dinamik raporlar oluştur
  const now = new Date();
  const currentMonth = now.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  const totalPolicies = policies.length;
  const totalRevenue = policies.reduce((sum, policy) => sum + policy.amount, 0);
  const totalCommission = Math.round(totalRevenue * 0.1);

  const recentReports = [
    {
      id: 1,
      name: `Aylık Satış Raporu - ${currentMonth}`,
      type: "PDF",
      size: "2.4 MB",
      date: now.toISOString().split("T")[0],
      status: "Tamamlandı",
      downloadUrl: `/api/admin/reports/export?format=pdf&period=month&type=all`,
    },
    {
      id: 2,
      name: `Komisyon Analizi - ${currentMonth}`,
      type: "Excel",
      size: "1.8 MB",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "Tamamlandı",
      downloadUrl: `/api/admin/reports/export?format=excel&period=month&type=commission`,
    },
    {
      id: 3,
      name: "Kullanıcı Performans Raporu",
      type: "PDF",
      size: "3.1 MB",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "Tamamlandı",
      downloadUrl: `/api/admin/reports/export?format=pdf&period=month&type=users`,
    },
    {
      id: 4,
      name: `Toplam ${totalPolicies} Poliçe Raporu`,
      type: "PDF",
      size: "1.5 MB",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "Tamamlandı",
      downloadUrl: `/api/admin/reports/export?format=pdf&period=all&type=all`,
    },
  ];

  res.status(200).json({
    reports: recentReports,
  });
}

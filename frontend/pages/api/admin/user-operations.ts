import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, limit = "50" } = req.query;
  const limitNum = parseInt(limit as string, 10);

  try {
    // Gerçek poliçe verilerinden işlemler oluştur
    let filteredPolicies = policies;

    // Kullanıcı ID'sine göre filtrele
    if (user_id && user_id !== "all") {
      filteredPolicies = policies.filter((policy) => policy.userId === user_id);
    }

    // İşlemleri formatla
    const operations = filteredPolicies.map((policy, index) => ({
      id: index + 1,
      user_id: policy.userId,
      user_name: policy.userName,
      giris_kanali: "PANEL",
      urun: policy.policyType.toUpperCase(),
      tutar: `${policy.amount.toLocaleString("tr-TR")} TL`,
      plaka: policy.policyDetails?.plaka || null,
      musteri_ad: policy.customerInfo?.name || "Müşteri Adı Bulunamadı",
      tarih: new Date(policy.createdAt).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      yenileme: false,
      pdf_file: `policy_${policy.id}.pdf`,
    }));

    // En yeni işlemler önce
    operations.sort(
      (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
    );

    // Limit uygula
    const limitedOperations = operations.slice(0, limitNum);

    // Özet bilgileri hesapla
    const totalAmount = policies.reduce(
      (sum, policy) => sum + policy.amount,
      0
    );
    const uniqueUsers = new Set(policies.map((policy) => policy.userId));

    res.status(200).json({
      operations: limitedOperations,
      total: operations.length,
      summary: {
        toplam_police: operations.length,
        toplam_tutar: totalAmount,
        kullanici_sayisi: uniqueUsers.size,
      },
    });
  } catch (error) {
    console.error("User operations API error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "İşlemler alınırken bir hata oluştu",
    });
  }
}

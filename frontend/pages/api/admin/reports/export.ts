import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { format, period, type } = req.body;

  // Gerçek poliçe verilerini hesapla
  const totalRevenue = policies.reduce((sum, policy) => sum + policy.amount, 0);
  const totalPolicies = policies.length;
  const totalCommission = Math.round(totalRevenue * 0.1);

  // Gerçek verilerle export data
  const exportData = {
    format,
    period,
    type,
    generatedAt: new Date().toISOString(),
    data: {
      totalRevenue,
      totalPolicies,
      totalCommission,
      period: period,
      reportType: type,
      policies: policies, // Gerçek poliçe verileri
    },
  };

  if (format === "pdf") {
    // Mock PDF content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Rapor: ${type} - ${period}) Tj
(Total Poliçe: ${totalPolicies}) Tj
(Total Gelir: ${totalRevenue.toLocaleString("tr-TR")} ₺) Tj
(Total Komisyon: ${totalCommission.toLocaleString("tr-TR")} ₺) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report-${
        new Date().toISOString().split("T")[0]
      }.pdf"`
    );
    res.status(200).send(pdfContent);
  } else if (format === "excel") {
    // Gerçek verilerle CSV content
    const csvContent = `Rapor Tipi,Dönem,Toplam Prim,Toplam Poliçe,Toplam Komisyon
${type},${period},${totalRevenue},${totalPolicies},${totalCommission}

Poliçe Detayları:
Poliçe ID,Kullanıcı,Şirket,Tür,Tutar,Tarih
${policies
  .map(
    (policy) =>
      `${policy.id},${policy.userName},${policy.company},${policy.policyType},${policy.amount},${policy.createdAt}`
  )
  .join("\n")}`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report-${
        new Date().toISOString().split("T")[0]
      }.csv"`
    );
    res.status(200).send(csvContent);
  } else {
    res.status(400).json({ error: "Unsupported format" });
  }
}

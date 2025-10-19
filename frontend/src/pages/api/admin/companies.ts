import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Mock sigorta şirketleri verisi
  const companies = [
    {
      id: 1,
      name: "Sompo Sigorta",
      logo: "/company-logos/sompo.png",
      status: "active",
      lastUpdate: "2025-10-20T01:30:00Z",
      policies: 15,
      revenue: 45000,
      commission: 4500,
    },
    {
      id: 2,
      name: "Quick Sigorta",
      logo: "/company-logos/quick.png",
      status: "active",
      lastUpdate: "2025-10-20T01:25:00Z",
      policies: 12,
      revenue: 36000,
      commission: 3600,
    },
    {
      id: 3,
      name: "Anadolu Sigorta",
      logo: "/company-logos/anadolu.png",
      status: "active",
      lastUpdate: "2025-10-20T01:20:00Z",
      policies: 8,
      revenue: 24000,
      commission: 2400,
    },
    {
      id: 4,
      name: "Allianz Sigorta",
      logo: "/company-logos/allianz.png",
      status: "active",
      lastUpdate: "2025-10-20T01:15:00Z",
      policies: 6,
      revenue: 18000,
      commission: 1800,
    },
    {
      id: 5,
      name: "Axa Sigorta",
      logo: "/company-logos/axa.png",
      status: "pending",
      lastUpdate: "2025-10-20T01:10:00Z",
      policies: 3,
      revenue: 9000,
      commission: 900,
    },
    {
      id: 6,
      name: "Generali Sigorta",
      logo: "/company-logos/generali.png",
      status: "pending",
      lastUpdate: "2025-10-20T01:05:00Z",
      policies: 2,
      revenue: 6000,
      commission: 600,
    },
  ];

  res.status(200).json({
    companies,
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    pending: companies.filter((c) => c.status === "pending").length,
  });
}

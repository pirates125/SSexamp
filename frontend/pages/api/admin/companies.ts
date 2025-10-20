import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Mock sigorta şirketleri verisi - Companies sayfası formatına uygun
  const companies = [
    {
      id: "1",
      name: "Anadolu Sigorta",
      logo: "/company-logos/anadolu.png",
      status: "active",
      lastQuery: "2024-03-15 14:30",
      successRate: 98.5,
      totalQueries: 1250,
    },
    {
      id: "2",
      name: "Sompo Sigorta",
      logo: "/company-logos/sompo.png",
      status: "active",
      lastQuery: "2024-03-15 15:20",
      successRate: 95.2,
      totalQueries: 890,
    },
    {
      id: "3",
      name: "Atlas Sigorta",
      logo: "/company-logos/atlas.png",
      status: "active",
      lastQuery: "2024-03-15 12:10",
      successRate: 97.8,
      totalQueries: 745,
    },
    {
      id: "4",
      name: "Koru Sigorta",
      logo: "/company-logos/koru.png",
      status: "maintenance",
      lastQuery: "2024-03-14 18:00",
      successRate: 92.3,
      totalQueries: 560,
    },
    {
      id: "5",
      name: "Quick Sigorta",
      logo: "/company-logos/quick.png",
      status: "active",
      lastQuery: "2024-03-15 16:45",
      successRate: 96.7,
      totalQueries: 820,
    },
    {
      id: "6",
      name: "Referans Sigorta",
      logo: "/company-logos/referans.png",
      status: "inactive",
      lastQuery: null,
      successRate: 0,
      totalQueries: 0,
    },
    {
      id: "7",
      name: "Doğa Sigorta",
      logo: "/company-logos/doga.png",
      status: "active",
      lastQuery: "2024-03-15 13:25",
      successRate: 94.1,
      totalQueries: 670,
    },
    {
      id: "8",
      name: "Şeker Sigorta",
      logo: "/company-logos/seker.png",
      status: "active",
      lastQuery: "2024-03-15 11:50",
      successRate: 93.8,
      totalQueries: 540,
    },
    {
      id: "9",
      name: "Allianz Sigorta",
      logo: "/company-logos/allianz.png",
      status: "active",
      lastQuery: "2024-03-15 10:30",
      successRate: 96.1,
      totalQueries: 420,
    },
    {
      id: "10",
      name: "Axa Sigorta",
      logo: "/company-logos/axa.png",
      status: "active",
      lastQuery: "2024-03-15 09:15",
      successRate: 94.8,
      totalQueries: 380,
    },
    {
      id: "11",
      name: "Generali Sigorta",
      logo: "/company-logos/generali.png",
      status: "active",
      lastQuery: "2024-03-15 08:45",
      successRate: 95.5,
      totalQueries: 320,
    },
  ];

  res.status(200).json({
    companies,
    total: companies.length,
    active: companies.filter((c) => c.status === "active").length,
    maintenance: companies.filter((c) => c.status === "maintenance").length,
    inactive: companies.filter((c) => c.status === "inactive").length,
  });
}

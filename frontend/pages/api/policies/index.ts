import type { NextApiRequest, NextApiResponse } from "next";
import { Policy } from "@/types/policy";
import { policies, addPolicy } from "@/data/mockDatabase";
import { rateLimiter, getClientIP } from "@/utils/rateLimiter";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const limiter = rateLimiter(60000, 100); // 1 dakikada 100 request
  if (!limiter(clientIP)) {
    return res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
    });
  }

  if (req.method === "POST") {
    // Yeni poliçe kesme
    const {
      userId,
      userName,
      userRole,
      policyType,
      company,
      amount,
      customerInfo,
      policyDetails,
    } = req.body;

    // Input validation
    if (!userId || !userName || !policyType || !company || !amount) {
      return res.status(400).json({
        success: false,
        error: "Eksik gerekli alanlar",
        message:
          "userId, userName, policyType, company ve amount alanları gereklidir",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz tutar",
        message: "Tutar 0'dan büyük olmalıdır",
      });
    }

    const newPolicy: Policy = {
      id: `POL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      userRole,
      policyType,
      company,
      amount,
      createdAt: new Date().toISOString(),
      status: "active",
      customerInfo,
      policyDetails,
    };

    addPolicy(newPolicy);

    res.status(201).json({
      success: true,
      policy: newPolicy,
      message: "Poliçe başarıyla kesildi",
    });
  } else if (req.method === "GET") {
    // Poliçeleri listele
    const { userId, policyType, startDate, endDate } = req.query;

    let filteredPolicies = policies;

    if (userId) {
      filteredPolicies = filteredPolicies.filter((p) => p.userId === userId);
    }

    if (policyType) {
      filteredPolicies = filteredPolicies.filter(
        (p) => p.policyType === policyType
      );
    }

    if (startDate && endDate) {
      filteredPolicies = filteredPolicies.filter((p) => {
        const policyDate = new Date(p.createdAt);
        return (
          policyDate >= new Date(startDate as string) &&
          policyDate <= new Date(endDate as string)
        );
      });
    }

    res.status(200).json({
      success: true,
      policies: filteredPolicies,
      total: filteredPolicies.length,
      totalAmount: filteredPolicies.reduce((sum, p) => sum + p.amount, 0),
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

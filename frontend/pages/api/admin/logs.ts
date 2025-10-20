import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { level, search, limit = 50 } = req.query;

  // Gerçek poliçe verilerinden dinamik loglar oluştur
  const logs = policies
    .map((policy, index) => {
      const logTypes = [
        {
          level: "success" as const,
          message: `${policy.policyType.toUpperCase()} poliçesi başarıyla kesildi`,
          action: "CREATE_POLICY",
        },
        {
          level: "info" as const,
          message: `${policy.company} teklifi alındı`,
          action: "GET_QUOTE",
        },
        {
          level: "warning" as const,
          message: `${policy.company} teklifi zaman aşımına uğradı`,
          action: "TIMEOUT",
        },
        {
          level: "error" as const,
          message: `${policy.company} API hatası`,
          action: "API_ERROR",
        },
      ];

      const logType = logTypes[index % logTypes.length];

      return {
        id: `log-${policy.id}`,
        timestamp: new Date(policy.createdAt).toLocaleString("tr-TR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        level: logType.level,
        message: logType.message,
        user: policy.userName,
        action: logType.action,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  // Filtreleme
  let filteredLogs = logs;

  if (level && level !== "all") {
    filteredLogs = filteredLogs.filter((log) => log.level === level);
  }

  if (search) {
    const searchLower = (search as string).toLowerCase();
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.message.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
    );
  }

  // Limit uygula
  const limitedLogs = filteredLogs.slice(0, Number(limit));

  // İstatistikler
  const stats = {
    total: logs.length,
    success: logs.filter((log) => log.level === "success").length,
    info: logs.filter((log) => log.level === "info").length,
    warning: logs.filter((log) => log.level === "warning").length,
    error: logs.filter((log) => log.level === "error").length,
  };

  res.status(200).json({
    logs: limitedLogs,
    stats,
    total: limitedLogs.length,
  });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { policies } from "@/data/mockDatabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gerçek poliçe verilerini hesapla
  const totalPremium = policies.reduce((sum, policy) => sum + policy.amount, 0);
  const totalPolicy = policies.length;
  const totalCommission = Math.round(totalPremium * 0.1); // %10 komisyon

  // Trend hesaplama (son 30 gün vs önceki 30 gün)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentPolicies = policies.filter(
    (policy) => new Date(policy.createdAt) >= thirtyDaysAgo
  );
  const previousPolicies = policies.filter(
    (policy) =>
      new Date(policy.createdAt) >= sixtyDaysAgo &&
      new Date(policy.createdAt) < thirtyDaysAgo
  );

  const recentRevenue = recentPolicies.reduce(
    (sum, policy) => sum + policy.amount,
    0
  );
  const previousRevenue = previousPolicies.reduce(
    (sum, policy) => sum + policy.amount,
    0
  );

  const recentCount = recentPolicies.length;
  const previousCount = previousPolicies.length;

  const revenueTrend =
    previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;
  const policyTrend =
    previousCount > 0
      ? ((recentCount - previousCount) / previousCount) * 100
      : 0;
  const commissionTrend =
    previousRevenue > 0
      ? ((recentRevenue * 0.1 - previousRevenue * 0.1) /
          (previousRevenue * 0.1)) *
        100
      : 0;

  res.status(200).json({
    total_premium: totalPremium,
    total_policy: totalPolicy,
    total_commission: totalCommission,
    revenue_trend: Math.round(revenueTrend * 10) / 10,
    policy_trend: Math.round(policyTrend * 10) / 10,
    commission_trend: Math.round(commissionTrend * 10) / 10,
  });
}

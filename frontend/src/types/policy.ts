// Poliçe veri modeli
export interface Policy {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  policyType: "trafik" | "kasko" | "konut" | "saglik";
  company: string;
  amount: number;
  createdAt: string;
  status: "active" | "cancelled" | "expired";
  customerInfo: {
    name: string;
    tcKimlik: string;
    phone: string;
    email: string;
    address: string;
  };
  policyDetails: {
    plaka?: string;
    kullanim?: string;
    kaskoDurumu?: string;
    hasarDurumu?: string;
    // Diğer poliçe detayları
  };
}

// Satış trendi veri modeli
export interface SalesTrend {
  month: string;
  year: number;
  totalAmount: number;
  policyCount: number;
  policies: Policy[];
}

// Kategori dağılımı veri modeli
export interface CategoryDistribution {
  category: string;
  count: number;
  amount: number;
  percentage: number;
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stats modeli
export interface DashboardStats {
  totalRevenue: number;
  totalPolicies: number;
  totalCommission: number;
  avgPolicy: number;
  businessHours: boolean;
  currentTime: string;
  quickSmsAvailable: boolean;
}

// Activity modeli
export interface Activity {
  id: string;
  type: string;
  company: string;
  user: string;
  price: number;
  plate?: string;
  time: string;
  status: "success" | "pending" | "error";
}

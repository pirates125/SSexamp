const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TrafikQuoteRequest {
  tc: string;
  ad: string;
  soyad: string;
  cep: string;
  email?: string;
  plaka: string;
  tescilSeri: string;
  tescilNo: string;
  bireysel: boolean;
}

export interface KaskoQuoteRequest extends TrafikQuoteRequest {
  marka: string;
  model: string;
  modelYili: string;
  kaskoTipi: string;
  imm: boolean;
}

export interface QuoteResponse {
  company: string;
  price: number;
  status: string;
  features: string[];
  policyNo: string;
}

export const apiService = {
  // Trafik teklifi al
  async getTrafikQuote(data: TrafikQuoteRequest): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/trafik`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          user_id: "emrah",
          user_name: "EMRAH ÖZTÜRK",
          giris_kanali: "panel",
          plaka: data.plaka,
          musteri_ad: `${data.ad} ${data.soyad}`,
          use_real_api: true, // Gerçek API kullan
        }),
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Trafik teklifi hatası:", error);
      throw error;
    }
  },

  // Kasko teklifi al
  async getKaskoQuote(data: KaskoQuoteRequest): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/kasko`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          user_id: "emrah",
          user_name: "EMRAH ÖZTÜRK",
          giris_kanali: "panel",
          plaka: data.plaka,
          musteri_ad: `${data.ad} ${data.soyad}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Kasko teklifi hatası:", error);
      throw error;
    }
  },

  // Dashboard verilerini al
  async getDashboard(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/dashboard`);
      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Dashboard verisi hatası:", error);
      throw error;
    }
  },

  // Teklifleri al
  async getOffers(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/offers`);
      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Teklifler hatası:", error);
      // Fallback: mock data döndür
      return {
        items: [
          {
            id: 9001,
            kalan_text: "2 gün kaldı",
            kalan_tip: "warn",
            musteri_ad: "Muhammet Eski",
            plaka: "06TG932",
            tarih: "20 Oct 2025 12:59",
            urun: "trafik",
            urun_kod: "T",
          },
          {
            id: 9002,
            kalan_text: "1 gün kaldı",
            kalan_tip: "",
            musteri_ad: "Gözde Kefal",
            plaka: "35BCF225",
            tarih: "20 Oct 2025 12:59",
            urun: "kasko",
            urun_kod: "K",
          },
          {
            id: 9003,
            kalan_text: "3 gün kaldı",
            kalan_tip: "err",
            musteri_ad: "Caner Genç",
            tarih: "20 Oct 2025 12:59",
            teklif_no: "TR-AV-2025-001",
            urun: "seyahat",
            urun_kod: "B",
          },
        ],
        total: 3,
      };
    }
  },

  // Poliçe PDF indir
  async downloadPolicyPDF(policyId: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/policy/${policyId}/pdf`);
      if (!response.ok) {
        throw new Error(`PDF indirme hatası: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `policy_${policyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("PDF indirme hatası:", error);
      throw error;
    }
  },

  // Admin - Kullanıcı işlemlerini getir
  async getUserOperations(userId?: string): Promise<any> {
    try {
      const url = userId
        ? `${API_URL}/api/admin/user-operations?user_id=${userId}`
        : `${API_URL}/api/admin/user-operations`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Kullanıcı işlemleri hatası:", error);
      throw error;
    }
  },

  // Admin - Tüm kullanıcıları getir
  async getUsers(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) {
        throw new Error(`API hatası: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Kullanıcılar hatası:", error);
      throw error;
    }
  },
};

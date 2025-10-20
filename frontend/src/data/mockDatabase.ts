// Mock veritabanı - tüm API'ler bu veriyi paylaşır
export let policies: any[] = [
  // Örnek poliçeler
  {
    id: "POL-1737362800000-example1",
    userId: "admin",
    userName: "EMRAH ÖZTÜRK",
    userRole: "admin",
    policyType: "trafik",
    company: "Anadolu Sigorta",
    amount: 2150,
    createdAt: "2025-10-20T10:41:00.000Z",
    status: "active",
    customerInfo: {
      name: "Bayram Pektaş",
      tcKimlik: "12345678901",
      phone: "05551234567",
      email: "bayram@example.com",
      address: "İstanbul, Türkiye",
    },
    policyDetails: {
      plaka: "28ADN676",
      tescilSeri: "A",
      tescilNo: "123456",
      bireysel: true,
    },
  },
  {
    id: "POL-1737362800001-example2",
    userId: "admin",
    userName: "EMRAH ÖZTÜRK",
    userRole: "admin",
    policyType: "trafik",
    company: "Axa Sigorta",
    amount: 2150,
    createdAt: "2025-10-20T12:01:00.000Z",
    status: "active",
    customerInfo: {
      name: "Mehmet Yılmaz",
      tcKimlik: "98765432109",
      phone: "05559876543",
      email: "mehmet@example.com",
      address: "Ankara, Türkiye",
    },
    policyDetails: {
      plaka: "34ABC123",
      tescilSeri: "B",
      tescilNo: "789012",
      bireysel: true,
    },
  },
];

export const addPolicy = (policy: any) => {
  policies.push(policy);
};

export const getPolicies = () => {
  return policies;
};

export const clearPolicies = () => {
  policies = [];
};

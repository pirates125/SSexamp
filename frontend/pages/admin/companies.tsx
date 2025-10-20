import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";

interface Company {
  id: string;
  name: string;
  logo: string;
  status: "active" | "inactive" | "maintenance";
  lastQuery: string | null;
  successRate: number;
  totalQueries: number;
}

export default function CompaniesPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Şirket verilerini çek
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/admin/companies");
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      } else {
        // Fallback mock data
        setCompanies([
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
        ]);
      }
    } catch (error) {
      console.error("Şirket verileri alınırken hata:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    } else if (user && user.role === "admin") {
      fetchCompanies();
    }
  }, [user, isLoading, router]);

  // Tümünü yenile fonksiyonu
  const handleRefreshAll = async () => {
    setRefreshing(true);
    await fetchCompanies();
  };

  const handleToggleStatus = (id: string) => {
    setCompanies(
      companies.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  // Ayarlar butonu fonksiyonu
  const handleSettings = (company: Company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  // Modal'ı kapat
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  // Ayarları kaydet
  const handleSaveSettings = () => {
    if (selectedCompany) {
      alert(`${selectedCompany.name} şirketi ayarları kaydedildi!`);
      handleCloseModal();
    }
  };

  const getStatusBadge = (status: Company["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Aktif</Badge>;
      case "inactive":
        return <Badge variant="danger">Pasif</Badge>;
      case "maintenance":
        return <Badge variant="warning">Bakımda</Badge>;
    }
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Şirket Yönetimi
            </h1>
            <p className="text-gray-600 mt-1">
              Sigorta şirketlerini ve entegrasyonlarını yönetin
            </p>
          </div>
          <Button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Yenileniyor..." : "Tümünü Yenile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam Şirket
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {companies.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Settings className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktif
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {companies.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bakımda
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {companies.filter((c) => c.status === "maintenance").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Settings className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pasif
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {companies.filter((c) => c.status === "inactive").length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şirket Listesi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Son Sorgu</TableHead>
                  <TableHead>Başarı Oranı</TableHead>
                  <TableHead>Toplam Sorgu</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        <span>Şirket verileri yükleniyor...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Şirket bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={company.logo}
                            alt={company.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(company.status)}</TableCell>
                      <TableCell>{company.lastQuery || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={
                            company.successRate > 95
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {company.successRate > 0
                            ? `%${company.successRate.toFixed(1)}`
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {company.totalQueries.toLocaleString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSettings(company)}
                            title={`${company.name} ayarları`}
                          >
                            <Settings size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(company.id)}
                          >
                            {company.status === "active" ? (
                              <XCircle size={16} className="text-red-600" />
                            ) : (
                              <CheckCircle
                                size={16}
                                className="text-green-600"
                              />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Şirket Ayarları Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCompany?.name} Ayarları
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="p-2"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Adı
              </label>
              <Input
                value={selectedCompany?.name || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={selectedCompany?.status || "active"}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="maintenance">Bakımda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <Input
                placeholder="https://api.example.com"
                defaultValue="https://api.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <Input
                type="password"
                placeholder="••••••••••••••••"
                defaultValue="••••••••••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (saniye)
              </label>
              <Input type="number" placeholder="30" defaultValue="30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry Count
              </label>
              <Input type="number" placeholder="3" defaultValue="3" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <Button variant="outline" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Kaydet
            </Button>
          </div>
        </div>
      </Modal>
    </ProfessionalLayout>
  );
}

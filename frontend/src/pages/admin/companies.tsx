import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Settings, CheckCircle, XCircle, RefreshCw } from "lucide-react";
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
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Anadolu Sigorta", logo: "/company-logos/anadolu.png", status: "active", lastQuery: "2024-03-15 14:30", successRate: 98.5, totalQueries: 1250 },
    { id: "2", name: "Sompo Sigorta", logo: "/company-logos/sompo.png", status: "active", lastQuery: "2024-03-15 15:20", successRate: 95.2, totalQueries: 890 },
    { id: "3", name: "Atlas Sigorta", logo: "/company-logos/atlas.png", status: "active", lastQuery: "2024-03-15 12:10", successRate: 97.8, totalQueries: 745 },
    { id: "4", name: "Koru Sigorta", logo: "/company-logos/koru.png", status: "maintenance", lastQuery: "2024-03-14 18:00", successRate: 92.3, totalQueries: 560 },
    { id: "5", name: "Quick Sigorta", logo: "/company-logos/quick.png", status: "active", lastQuery: "2024-03-15 16:45", successRate: 96.7, totalQueries: 820 },
    { id: "6", name: "Referans Sigorta", logo: "/company-logos/referans.png", status: "inactive", lastQuery: null, successRate: 0, totalQueries: 0 },
    { id: "7", name: "Doğa Sigorta", logo: "/company-logos/doga.png", status: "active", lastQuery: "2024-03-15 13:25", successRate: 94.1, totalQueries: 670 },
    { id: "8", name: "Şeker Sigorta", logo: "/company-logos/seker.png", status: "active", lastQuery: "2024-03-15 11:50", successRate: 93.8, totalQueries: 540 },
  ]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleToggleStatus = (id: string) => {
    setCompanies(
      companies.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Şirket Yönetimi</h1>
            <p className="text-gray-600 mt-1">Sigorta şirketlerini ve entegrasyonlarını yönetin</p>
          </div>
          <Button>
            <RefreshCw size={18} />
            Tümünü Yenile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Şirket</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{companies.length}</p>
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
                  <p className="text-sm text-gray-600">Aktif</p>
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
                  <p className="text-sm text-gray-600">Bakımda</p>
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
                  <p className="text-sm text-gray-600">Pasif</p>
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
                {companies.map((company) => (
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
                      <span className={company.successRate > 95 ? "text-green-600 font-medium" : "text-gray-600"}>
                        {company.successRate > 0 ? `%${company.successRate.toFixed(1)}` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>{company.totalQueries.toLocaleString("tr-TR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
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
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  </ProfessionalLayout>
  );
}



import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/Stats";
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  PieChart,
} from "lucide-react";

export default function ReportsPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPolicies: 0,
    totalCommission: 0,
    avgPolicy: 0,
    trends: {
      revenue: { value: "0%", isPositive: true },
      policies: { value: "0%", isPositive: true },
      commission: { value: "0%", isPositive: true }
    }
  });

  useEffect(() => {
    // Gerçek istatistikleri backend'den çek
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalRevenue: data.total_premium || 0,
          totalPolicies: data.total_policy || 0,
          totalCommission: data.total_commission || 0,
          avgPolicy: data.total_policy ? Math.round((data.total_premium || 0) / data.total_policy) : 0,
          trends: {
            revenue: { 
              value: `${(data.revenue_trend || 0).toFixed(1)}%`,
              isPositive: (data.revenue_trend || 0) >= 0 
            },
            policies: { 
              value: `${(data.policy_trend || 0).toFixed(1)}%`,
              isPositive: (data.policy_trend || 0) >= 0 
            },
            commission: { 
              value: `${(data.commission_trend || 0).toFixed(1)}%`,
              isPositive: (data.commission_trend || 0) >= 0 
            }
          }
        });
      });
  }, []);

  // İstatistikleri kullanarak rapor tiplerini oluştur
  const reportTypes = [
    { 
      id: "sales", 
      name: "Satış Raporu", 
      icon: DollarSign, 
      count: stats.totalPolicies 
    },
    { 
      id: "commission", 
      name: "Komisyon Raporu", 
      icon: TrendingUp, 
      count: Math.round(stats.totalCommission / stats.totalRevenue * 100) 
    },
    { 
      id: "user", 
      name: "Kullanıcı Performansı", 
      icon: Users, 
      count: stats.avgPolicy 
    },
    { 
      id: "company", 
      name: "Şirket Bazlı", 
      icon: FileText, 
      count: Math.round(stats.totalRevenue / stats.totalPolicies) 
    },
  ];

  interface Report {
    id: number;
    name: string;
    type: string;
    size: string;
    date: string;
    status: string;
    downloadUrl: string;
  }

  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    // Son raporları backend'den çek
    fetch("/api/admin/reports/recent")
      .then((res) => res.json())
      .then((data) => {
        setRecentReports(data.reports || []);
      })
      .catch((err) => {
        console.error("Son raporlar yüklenirken hata:", err);
      });
  }, []);

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "pdf",
          period: selectedPeriod,
          type: selectedType,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${new Date().toISOString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("PDF dışa aktarma başarısız");
      }
    } catch (error) {
      console.error("PDF dışa aktarma hatası:", error);
      alert("PDF dışa aktarma sırasında bir hata oluştu");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "excel",
          period: selectedPeriod,
          type: selectedType,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${new Date().toISOString()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Excel dışa aktarma başarısız");
      }
    } catch (error) {
      console.error("Excel dışa aktarma hatası:", error);
      alert("Excel dışa aktarma sırasında bir hata oluştu");
    }
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Prim"
            value={`${stats.totalRevenue.toLocaleString("tr-TR")} ₺`}
            icon={DollarSign}
            trend={stats.trends.revenue}
          />
          <StatsCard
            title="Toplam Poliçe"
            value={stats.totalPolicies}
            icon={FileText}
            trend={stats.trends.policies}
          />
          <StatsCard
            title="Toplam Komisyon"
            value={`${stats.totalCommission.toLocaleString("tr-TR")} ₺`}
            icon={TrendingUp}
            trend={stats.trends.commission}
          />
          <StatsCard
            title="Ortalama Poliçe"
            value={`${stats.avgPolicy.toLocaleString("tr-TR")} ₺`}
            icon={BarChart3}
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Rapor Üret</CardTitle>
              <div className="flex gap-2">
                <Button className="brand-btn" onClick={handleExportPDF}>
                  <Download size={16} />
                  PDF
                </Button>
                <Button className="brand-btn" onClick={handleExportExcel}>
                  <Download size={16} />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dönem</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="today">Bugün</option>
                  <option value="week">Bu Hafta</option>
                  <option value="month">Bu Ay</option>
                  <option value="quarter">Bu Çeyrek</option>
                  <option value="year">Bu Yıl</option>
                  <option value="custom">Özel Tarih</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Tipi</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Tüm Raporlar</option>
                  <option value="sales">Satış</option>
                  <option value="commission">Komisyon</option>
                  <option value="user">Kullanıcı</option>
                  <option value="company">Şirket</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <BarChart3 size={16} />
                  Rapor Oluştur
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{type.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{type.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600">Toplam Rapor</p>
              <p className="text-2xl font-bold text-gray-900">{recentReports.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600">Toplam Prim</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600">Ortalama Poliçe</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPolicy.toLocaleString('tr-TR')} ₺</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Son Raporlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Henüz rapor oluşturulmamış
                </div>
              )}
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      report.type === "PDF" ? "bg-red-100" : "bg-green-100"
                    }`}>
                      <FileText className={
                        report.type === "PDF" ? "text-red-600" : "text-green-600"
                      } size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{report.type}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{report.size}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(report.downloadUrl, '_blank')}
                  >
                    <Download size={16} />
                    İndir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aylık Satış Trendi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="mx-auto text-blue-600 mb-2" size={48} />
                  <p className="text-gray-600">Grafik yakında eklenecek</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kategori Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="mx-auto text-purple-600 mb-2" size={48} />
                  <p className="text-gray-600">Grafik yakında eklenecek</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  </ProfessionalLayout>
  );
}



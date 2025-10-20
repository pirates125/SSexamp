import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { StatsCard } from "@/components/ui/Stats";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/services/api";
import {
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  Car,
  Home as HomeIcon,
  Heart,
  Shield,
  Activity,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [timeFilter, setTimeFilter] = useState("today");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPolicies: 0,
    totalCommission: 0,
    avgPolicy: 0,
    businessHours: false,
    currentTime: "",
    quickSmsAvailable: false,
  });

  const [companies, setCompanies] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Grafik verileri
  const [salesTrendData, setSalesTrendData] = useState([
    { month: "Ocak", amount: 2400000, policies: 45 },
    { month: "Şubat", amount: 2800000, policies: 52 },
    { month: "Mart", amount: 3200000, policies: 61 },
    { month: "Nisan", amount: 2900000, policies: 55 },
    { month: "Mayıs", amount: 3500000, policies: 68 },
    { month: "Haziran", amount: 3100000, policies: 59 },
  ]);

  const [categoryData, setCategoryData] = useState([
    { name: "Trafik", value: 45, amount: 1800000, color: "#3B82F6" },
    { name: "Kasko", value: 30, amount: 2400000, color: "#10B981" },
    { name: "Konut", value: 15, amount: 900000, color: "#F59E0B" },
    { name: "Sağlık", value: 10, amount: 600000, color: "#EF4444" },
  ]);

  // Filtre fonksiyonları
  const filterPoliciesByTime = (policies: any[]) => {
    const now = new Date();

    switch (timeFilter) {
      case "today":
        return policies.filter((policy) => {
          const policyDate = new Date(policy.createdAt);
          return policyDate.toDateString() === now.toDateString();
        });

      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return policies.filter((policy) => {
          const policyDate = new Date(policy.createdAt);
          return policyDate >= weekAgo;
        });

      case "custom":
        if (dateRange.start && dateRange.end) {
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return policies.filter((policy) => {
            const policyDate = new Date(policy.createdAt);
            return policyDate >= startDate && policyDate <= endDate;
          });
        }
        return policies;

      default:
        return policies;
    }
  };

  // --- İstatistikleri çek ---
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Gerçek poliçe verilerini çek
        const [policiesResponse, companiesResponse, activitiesResponse] =
          await Promise.all([
            fetch("/api/policies"),
            fetch("/api/admin/companies"),
            fetch("/api/admin/activities"),
          ]);

        if (policiesResponse.ok) {
          const policiesData = await policiesResponse.json();
          const allPolicies = policiesData.policies || [];

          // Filtre uygula
          const filteredPolicies = filterPoliciesByTime(allPolicies);

          // Filtrelenmiş verilerden istatistikleri hesapla
          const totalRevenue = filteredPolicies.reduce(
            (sum: number, policy: any) => sum + policy.amount,
            0
          );
          const totalPolicies = filteredPolicies.length;
          const totalCommission = Math.round(totalRevenue * 0.1); // %10 komisyon
          const avgPolicy =
            totalPolicies > 0 ? Math.round(totalRevenue / totalPolicies) : 0;

          setStats({
            totalRevenue,
            totalPolicies,
            totalCommission,
            avgPolicy,
            businessHours: true,
            currentTime: new Date().toLocaleTimeString("tr-TR"),
            quickSmsAvailable: true,
          });

          // Grafik verilerini filtrelenmiş verilerle güncelle
          updateChartData(filteredPolicies);
        }

        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData.companies || []);
        }

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setActivities(activitiesData.activities || []);
        }
      } catch (error) {
        console.error("Dashboard verileri alınırken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();

    // Her 30 saniyede bir güncelle (sadece production'da)
    const interval = setInterval(
      fetchDashboard,
      process.env.NODE_ENV === "production" ? 30000 : 60000
    );
    return () => clearInterval(interval);
  }, [timeFilter, dateRange.start, dateRange.end]);

  // --- Teklifleri çek ---
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await apiService.getOffers();
        setOffers(data.items || []);
      } catch (error) {
        console.error("Teklifler alınamadı:", error);
      }
    };
    fetchOffers();
  }, []);

  // --- Şirketleri çek ---
  useEffect(() => {
    fetch("/api/admin/companies")
      .then((res) => res.json())
      .then((data) => {
        // API'den gelen data.companies array'ini set et
        if (data.companies && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        } else {
          // Fallback data
          setCompanies([
            {
              name: "Anadolu Sigorta",
              logo: "/company-logos/anadolu.png",
              status: "active",
              lastQuery: "5 dk önce",
            },
            {
              name: "Sompo Sigorta",
              logo: "/company-logos/sompo.png",
              status: "active",
              lastQuery: "2 dk önce",
            },
            {
              name: "Atlas Sigorta",
              logo: "/company-logos/atlas.png",
              status: "active",
              lastQuery: "12 dk önce",
            },
            {
              name: "Koru Sigorta",
              logo: "/company-logos/koru.png",
              status: "maintenance",
              lastQuery: "1 saat önce",
            },
            {
              name: "Referans Sigorta",
              logo: "/company-logos/referans.png",
              status: "inactive",
              lastQuery: "-",
            },
          ]);
        }
      })
      .catch(() =>
        setCompanies([
          {
            name: "Anadolu Sigorta",
            logo: "/company-logos/anadolu.png",
            status: "active",
            lastQuery: "5 dk önce",
          },
          {
            name: "Sompo Sigorta",
            logo: "/company-logos/sompo.png",
            status: "active",
            lastQuery: "2 dk önce",
          },
          {
            name: "Atlas Sigorta",
            logo: "/company-logos/atlas.png",
            status: "active",
            lastQuery: "12 dk önce",
          },
          {
            name: "Koru Sigorta",
            logo: "/company-logos/koru.png",
            status: "maintenance",
            lastQuery: "1 saat önce",
          },
          {
            name: "Referans Sigorta",
            logo: "/company-logos/referans.png",
            status: "inactive",
            lastQuery: "-",
          },
        ])
      );
  }, []);

  // Grafik verilerini güncelle
  const updateChartData = (policies: any[]) => {
    // Aylık satış trendi hesapla
    const monthlyData: { [key: string]: { amount: number; policies: number } } =
      {};

    policies.forEach((policy) => {
      const date = new Date(policy.createdAt);
      const monthKey = date.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { amount: 0, policies: 0 };
      }

      monthlyData[monthKey].amount += policy.amount;
      monthlyData[monthKey].policies += 1;
    });

    // Son 6 ayı al
    const months = Object.keys(monthlyData).slice(-6);
    const salesTrendData = months.map((month) => ({
      month: month.split(" ")[0], // Sadece ay adı
      amount: monthlyData[month].amount,
      policies: monthlyData[month].policies,
    }));

    setSalesTrendData(salesTrendData);

    // Kategori dağılımını hesapla
    const categoryStats: { [key: string]: { count: number; amount: number } } =
      {};

    policies.forEach((policy) => {
      if (!categoryStats[policy.policyType]) {
        categoryStats[policy.policyType] = { count: 0, amount: 0 };
      }

      categoryStats[policy.policyType].count += 1;
      categoryStats[policy.policyType].amount += policy.amount;
    });

    const totalPolicies = policies.length;
    const categoryData = Object.entries(categoryStats).map(([type, stats]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: stats.count,
      amount: stats.amount,
      percentage:
        totalPolicies > 0 ? Math.round((stats.count / totalPolicies) * 100) : 0,
      color: getCategoryColor(type),
    }));

    setCategoryData(categoryData);
  };

  // Kategori rengi belirle
  const getCategoryColor = (type: string) => {
    const colors: { [key: string]: string } = {
      trafik: "#3B82F6",
      kasko: "#10B981",
      konut: "#F59E0B",
      saglik: "#EF4444",
    };
    return colors[type] || "#6B7280";
  };

  // --- Son Aktiviteleri dinamik çek ---
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Admin activities API'sini kullan
        const response = await fetch("/api/admin/activities");
        if (response.ok) {
          const activitiesData = await response.json();
          setActivities(activitiesData || []);
        } else {
          // Fallback: mock aktiviteler
          setActivities([
            {
              id: "1",
              type: "Trafik Teklifi",
              company: "Anadolu Sigorta",
              user: "Ahmet Yılmaz",
              price: 2500,
              plate: "34ABC123",
              time: new Date().toISOString(),
              status: "success",
            },
          ]);
        }
      } catch (error) {
        console.error("Aktiviteler alınırken hata:", error);
        setActivities([]);
      }
    };

    fetchActivities();
    const interval = setInterval(
      fetchActivities,
      process.env.NODE_ENV === "production" ? 15000 : 30000
    );
    return () => clearInterval(interval);
  }, []);

  const teklifModulleri = [
    {
      name: "Trafik",
      path: "/trafik",
      icon: Car,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Kasko",
      path: "/kasko",
      icon: Shield,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      name: "Konut",
      path: "/konut",
      icon: HomeIcon,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      name: "Sağlık",
      path: "/saglik",
      icon: Heart,
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      name: "Tamamlayıcı Sağlık",
      path: "/tamamlayici",
      icon: Activity,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
    {
      name: "IMM",
      path: "/imm",
      icon: Car,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge variant="success">Aktif</Badge>;
    if (status === "maintenance")
      return <Badge variant="warning">Bakımda</Badge>;
    return <Badge variant="danger">Pasif</Badge>;
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Başlık + Filtre */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Hoş geldin,{" "}
              <span className="text-primary">
                {user?.username ?? "Kullanıcı"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Güncel istatistik özeti ve sistem durumu
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            <Button
              size="sm"
              variant={timeFilter === "today" ? "primary" : "outline"}
              onClick={() => {
                setTimeFilter("today");
                setDateRange({ start: "", end: "" }); // Reset custom date range
              }}
              className={`transition-all duration-200 ${
                timeFilter === "today"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              Bugün
            </Button>
            <Button
              size="sm"
              variant={timeFilter === "week" ? "primary" : "outline"}
              onClick={() => {
                setTimeFilter("week");
                setDateRange({ start: "", end: "" }); // Reset custom date range
              }}
              className={`transition-all duration-200 ${
                timeFilter === "week"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              Bu Hafta
            </Button>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                if (e.target.value && dateRange.end) {
                  setTimeFilter("custom");
                }
              }}
              className="border border-border text-foreground bg-background focus:ring-2 focus:ring-primary rounded-md px-2 py-1 text-sm"
              placeholder="Başlangıç tarihi"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange({ ...dateRange, end: e.target.value });
                if (dateRange.start && e.target.value) {
                  setTimeFilter("custom");
                }
              }}
              className="border border-border text-foreground bg-background focus:ring-2 focus:ring-primary rounded-md px-2 py-1 text-sm"
              placeholder="Bitiş tarihi"
            />
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          <StatsCard
            title="Toplam Prim"
            value={`${stats.totalRevenue.toLocaleString("tr-TR")} ₺`}
            icon={DollarSign}
          />
          <StatsCard
            title="Toplam Poliçe"
            value={stats.totalPolicies}
            icon={FileText}
          />
          <StatsCard
            title="Toplam Komisyon"
            value={`${stats.totalCommission.toLocaleString("tr-TR")} ₺`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Ortalama Poliçe"
            value={`${stats.avgPolicy.toLocaleString("tr-TR")} ₺`}
            icon={BarChart3}
          />

          <StatsCard
            title="Mesai Saati"
            value={stats.businessHours ? "Açık" : "Kapalı"}
            icon={stats.businessHours ? CheckCircle : Clock}
            trend={stats.currentTime}
            trendUp={stats.businessHours}
          />

          <StatsCard
            title="Quick SMS"
            value={stats.quickSmsAvailable ? "Mevcut" : "Mevcut Değil"}
            icon={Activity}
            trend={
              stats.quickSmsAvailable
                ? "SMS doğrulama aktif"
                : "Mesai saati dışında"
            }
            trendUp={stats.quickSmsAvailable}
          />
        </div>

        {/* Hızlı Teklif */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 font-semibold">
              Hızlı Teklif Oluştur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {teklifModulleri.map((modul) => {
                const Icon = modul.icon;
                return (
                  <button
                    key={modul.name}
                    onClick={() => router.push(modul.path)}
                    className={`${modul.color} text-white py-4 sm:py-5 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon size={26} />
                      <span className="text-xs sm:text-sm font-semibold text-center">
                        {modul.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tekliflerim */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold border-b border-gray-200 pb-1">
              TEKLİFLERİM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offers.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Henüz teklif bulunamadı.
                </p>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-modern-lg transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-primary" />
                        <span className="font-semibold text-sm text-card-foreground">
                          {offer.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {offer.plaka}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {offer.musteri_ad} • {offer.tarih}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center justify-end gap-3">
                      <span className="font-bold text-sm text-card-foreground">
                        {offer.tutar}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => apiService.downloadPolicyPDF(offer.id)}
                        className="border-border text-card-foreground hover:bg-accent"
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Şirketler + Son Aktiviteler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Şirketler */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold border-b border-gray-200 pb-1">
                ŞİRKETLER
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {companies && Array.isArray(companies) ? (
                  companies.map((company) => (
                    <div
                      key={company.name}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted rounded-xl hover:bg-accent transition-all duration-300 hover:scale-[1.01] animate-slide-in"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={32}
                          height={32}
                          className="object-contain rounded-lg dark:opacity-80"
                        />
                        <span className="font-semibold text-sm text-card-foreground">
                          {company.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{company.lastQuery}</span>
                        {getStatusBadge(company.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Şirket bilgileri yükleniyor...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Son Aktiviteler */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-bold border-b border-gray-200 pb-1">
                  Son Aktiviteler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/user-operations")}
                >
                  Kullanıcı İşlemleri <ChevronRight size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Henüz işlem bulunamadı.
                  </p>
                ) : (
                  activities.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-lg border bg-white flex flex-col sm:flex-row sm:items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {a.status === "success" ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Clock size={14} className="text-yellow-600" />
                          )}
                          <span className="font-semibold text-sm">
                            {a.type}
                          </span>
                          {a.plate && (
                            <span className="text-xs text-gray-600">
                              • {a.plate}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {a.company} • {a.user} •{" "}
                          {new Date(a.time).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center justify-end gap-2">
                        <span className="font-bold text-sm">
                          {a.price?.toLocaleString("tr-TR")} ₺
                        </span>
                        <Badge
                          variant={
                            a.status === "success" ? "success" : "warning"
                          }
                        >
                          {a.status === "success" ? "✓" : "⏳"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aylık Satış Trendi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Aylık Satış Trendi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value.toLocaleString("tr-TR")} ₺`,
                      name === "amount" ? "Satış Tutarı" : "Poliçe Sayısı",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Kategori Dağılımı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Kategori Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.amount.toLocaleString("tr-TR")} ₺`,
                      "Tutar",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Kategori Detayları */}
              <div className="mt-4 space-y-2">
                {categoryData.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {category.value} poliçe
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.amount.toLocaleString("tr-TR")} ₺
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfessionalLayout>
  );
}

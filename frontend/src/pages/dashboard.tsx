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

  // --- İstatistikleri çek ---
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiService.getDashboard();
        setStats({
          totalRevenue: data.totalRevenue || 0,
          totalPolicies: data.police_sayisi || 0,
          totalCommission: data.totalCommission || 0,
          avgPolicy: data.avgPolicy || 0,
          businessHours: data.businessHours || false,
          currentTime: data.currentTime || "",
          quickSmsAvailable: data.quickSmsAvailable || false,
        });
      } catch (error) {
        console.error("Dashboard verisi alınamadı:", error);
      }
    };
    fetchDashboard();
  }, [timeFilter, dateRange]);

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

  // --- Son Aktiviteleri dinamik çek ---
  useEffect(() => {
    const fetchActivities = () => {
      fetch("/api/admin/activities")
        .then((res) => res.json())
        .then((data) => setActivities(data))
        .catch(() => setActivities([]));
    };
    fetchActivities();
    const interval = setInterval(fetchActivities, 15000); // 15 saniyede bir yenile
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
      <div className="max-w-7xl mx-auto space-y-8 px-6 sm:px-8 md:px-12 lg:px-16">
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
              onClick={() => setTimeFilter("today")}
              className={`!text-gray-800 ${
                timeFilter === "today" ? "text-white" : ""
              }`}
            >
              Bugün
            </Button>
            <Button
              size="sm"
              variant={timeFilter === "week" ? "primary" : "outline"}
              onClick={() => setTimeFilter("week")}
              className={`!text-gray-800 ${
                timeFilter === "week" ? "text-white" : ""
              }`}
            >
              Bu Hafta
            </Button>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border border-blue-400 text-gray-800 bg-white focus:ring focus:ring-blue-200 rounded-md px-2 py-1 text-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border border-blue-400 text-gray-800 bg-white focus:ring focus:ring-blue-200 rounded-md px-2 py-1 text-sm"
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
      </div>
    </ProfessionalLayout>
  );
}

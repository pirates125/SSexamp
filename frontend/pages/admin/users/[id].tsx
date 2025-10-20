import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/Stats";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import {
  ArrowLeft,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  Edit,
  Save,
  Car,
  Home as HomeIcon,
  Heart,
  Shield,
} from "lucide-react";

interface PolicyData {
  id: string;
  date: string;
  type: string;
  company: string;
  policyNo: string;
  amount: number;
  commission: number;
}

export default function UserDetailPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  
  const [editMode, setEditMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2024-10");
  const [userCommission, setUserCommission] = useState(15); // %15 default
  
  const [userData] = useState({
    id: "1",
    username: "sube",
    email: "sube@esigorta.com",
    role: "branch",
    fullName: "Şube Kullanıcısı",
    phone: "+90 555 123 4567",
    joinDate: "2024-01-15",
  });

  // Mock poliçe verileri
  const [policies] = useState<PolicyData[]>([
    { id: "1", date: "2024-10-01", type: "Trafik", company: "Anadolu", policyNo: "TRF-2024-001", amount: 1850, commission: 277.50 },
    { id: "2", date: "2024-10-02", type: "Kasko", company: "Sompo", policyNo: "KSK-2024-001", amount: 4250, commission: 637.50 },
    { id: "3", date: "2024-10-03", type: "Konut", company: "Atlas", policyNo: "KNT-2024-001", amount: 1200, commission: 180 },
    { id: "4", date: "2024-10-03", type: "Sağlık", company: "Quick", policyNo: "SGL-2024-001", amount: 3500, commission: 525 },
    { id: "5", date: "2024-10-05", type: "Trafik", company: "Anadolu", policyNo: "TRF-2024-002", amount: 1920, commission: 288 },
    { id: "6", date: "2024-10-06", type: "Kasko", company: "Doga", policyNo: "KSK-2024-002", amount: 5100, commission: 765 },
    { id: "7", date: "2024-10-07", type: "TSS", company: "Sompo", policyNo: "TSS-2024-001", amount: 2800, commission: 420 },
    { id: "8", date: "2024-10-08", type: "İMM", company: "Quick", policyNo: "IMM-2024-001", amount: 950, commission: 142.50 },
    { id: "9", date: "2024-10-09", type: "Trafik", company: "Atlas", policyNo: "TRF-2024-003", amount: 1800, commission: 270 },
    { id: "10", date: "2024-10-10", type: "Kasko", company: "Sompo", policyNo: "KSK-2024-003", amount: 4800, commission: 720 },
  ]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // İstatistik hesaplamaları
  const totalPolicies = policies.length;
  const totalPremium = policies.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = policies.reduce((sum, p) => sum + p.commission, 0);

  // Kategoriye göre adetler
  const policyCounts = policies.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Günlük gruplandırma
  const dailyStats = policies.reduce((acc, p) => {
    const date = p.date;
    if (!acc[date]) {
      acc[date] = { policies: [], totalAmount: 0, totalCommission: 0, count: 0 };
    }
    acc[date].policies.push(p);
    acc[date].totalAmount += p.amount;
    acc[date].totalCommission += p.commission;
    acc[date].count++;
    return acc;
  }, {} as Record<string, { policies: PolicyData[]; totalAmount: number; totalCommission: number; count: number }>);

  const handleSaveCommission = () => {
    setEditMode(false);
    // API call would go here
    alert(`Komisyon oranı %${userCommission} olarak güncellendi`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Trafik":
      case "İMM":
        return <Car size={16} className="text-blue-600" />;
      case "Kasko":
        return <Shield size={16} className="text-purple-600" />;
      case "Konut":
        return <HomeIcon size={16} className="text-green-600" />;
      case "Sağlık":
      case "TSS":
        return <Heart size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <ArrowLeft size={18} />
              Geri
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{userData.fullName}</h1>
              <p className="text-gray-600 mt-1">Kullanıcı Performans Detayı</p>
            </div>
          </div>
          <Badge variant={userData.role === "admin" ? "danger" : "info"}>
            {userData.role === "admin" ? "Yönetici" : "Şube"}
          </Badge>
        </div>

        {/* Kullanıcı Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kullanıcı Adı</p>
                <p className="font-semibold text-gray-900">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-posta</p>
                <p className="font-semibold text-gray-900">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefon</p>
                <p className="font-semibold text-gray-900">{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kayıt Tarihi</p>
                <p className="font-semibold text-gray-900">
                  {new Date(userData.joinDate).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Komisyon Ayarı */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Komisyon Oranı</CardTitle>
              {!editMode ? (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                  <Edit size={16} />
                  Düzenle
                </Button>
              ) : (
                <Button size="sm" onClick={handleSaveCommission}>
                  <Save size={16} />
                  Kaydet
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {editMode ? (
                  <Input
                    type="number"
                    value={userCommission}
                    onChange={(e) => setUserCommission(Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-blue-600">%{userCommission}</span>
                    <span className="text-gray-600">komisyon oranı</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Bu aya kadar toplam kazanç</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalCommission.toLocaleString("tr-TR")} ₺
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aylık İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Poliçe"
            value={totalPolicies}
            icon={FileText}
            trend={{ value: "+12.5%", isPositive: true }}
          />
          <StatsCard
            title="Toplam Prim"
            value={`${totalPremium.toLocaleString("tr-TR")} ₺`}
            icon={DollarSign}
            trend={{ value: "+8.3%", isPositive: true }}
          />
          <StatsCard
            title="Toplam Komisyon"
            value={`${totalCommission.toLocaleString("tr-TR")} ₺`}
            icon={TrendingUp}
            trend={{ value: "+15.2%", isPositive: true }}
          />
          <StatsCard
            title="Ortalama Prim"
            value={`${Math.round(totalPremium / totalPolicies).toLocaleString("tr-TR")} ₺`}
            icon={Calendar}
          />
        </div>

        {/* Kategori Bazlı Poliçeler */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Bazında Poliçe Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(policyCounts).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-2">
                    {getTypeIcon(type)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Günlük Performans */}
        <Card>
          <CardHeader>
            <CardTitle>Günlük Performans Detayı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dailyStats)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, stats]) => (
                  <div key={date} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-600" size={20} />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(date).toLocaleDateString("tr-TR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{stats.count} adet poliçe</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Toplam Prim</p>
                        <p className="text-lg font-bold text-gray-900">
                          {stats.totalAmount.toLocaleString("tr-TR")} ₺
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Komisyon: {stats.totalCommission.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stats.policies.map((policy) => (
                        <Badge key={policy.id} variant="info">
                          {policy.type} - {policy.amount.toLocaleString("tr-TR")} ₺
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Tüm Poliçeler Tablosu */}
        <Card>
          <CardHeader>
            <CardTitle>Tüm Poliçeler</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Poliçe No</TableHead>
                  <TableHead className="text-right">Prim Tutarı</TableHead>
                  <TableHead className="text-right">Komisyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      {new Date(policy.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(policy.type)}
                        {policy.type}
                      </div>
                    </TableCell>
                    <TableCell>{policy.company}</TableCell>
                    <TableCell className="font-mono text-sm">{policy.policyNo}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {policy.amount.toLocaleString("tr-TR")} ₺
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {policy.commission.toLocaleString("tr-TR")} ₺
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


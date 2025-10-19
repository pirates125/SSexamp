import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { StatsCard } from "@/components/ui/Stats";
import { Plus, Search, Shield, Users as UsersIcon, User, TrendingUp, Eye, FileText } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "admin" | "branch" | "user";
  status: "active" | "inactive";
  createdAt: string;
  commission: number;
  monthlyPolicies: number;
  monthlyRevenue: number;
}
export default function UsersPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Kullanicilari yukle
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Kullanicilar yuklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const filteredUsers = users.filter(
    (u) => {
      const matchesSearch = 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || u.role === filterRole;
      const matchesStatus = filterStatus === "all" || u.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    }
  );

  // Kategorilere göre grupla
  const adminUsers = filteredUsers.filter(u => u.role === "admin");
  const branchUsers = filteredUsers.filter(u => u.role === "branch");
  const regularUsers = filteredUsers.filter(u => u.role === "user");

  // Gerçek istatistikler (tüm kullanıcılar için)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPolicies: 0,
    totalCommission: 0,
    avgPolicy: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalRevenue: data.total_premium || 0,
          totalPolicies: data.total_policy || 0,
          totalCommission: data.total_commission || 0,
          avgPolicy: data.total_policy ? Math.round((data.total_premium || 0) / data.total_policy) : 0,
        });
      });
  }, []);

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="danger">Yönetici</Badge>;
      case "branch":
        return <Badge variant="info">Şube</Badge>;
      default:
        return <Badge variant="default">Kullanıcı</Badge>;
    }
  };

  const UserCard = ({ user: u }: { user: User }) => (
    <div
      onClick={() => handleViewUser(u.id)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-102"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${
            u.role === "admin" ? "bg-red-100" : u.role === "branch" ? "bg-blue-100" : "bg-gray-100"
          }`}>
            <User size={20} className={
              u.role === "admin" ? "text-red-600" : u.role === "branch" ? "text-blue-600" : "text-gray-600"
            } />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{u.fullName}</h3>
            <p className="text-sm text-gray-500">@{u.username}</p>
          </div>
        </div>
        {getRoleBadge(u.role)}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">E-posta:</span>
          <span className="text-gray-900">{u.email}</span>
        </div>
        {u.commission > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Komisyon:</span>
            <span className="font-semibold text-blue-600">%{u.commission}</span>
          </div>
        )}
      </div>

      {u.monthlyRevenue > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600">Bu Ay Poliçe</p>
              <p className="text-lg font-bold text-gray-900">{u.monthlyPolicies}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Toplam Prim</p>
              <p className="text-lg font-bold text-green-600">
                {u.monthlyRevenue.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Badge variant={u.status === "active" ? "success" : "default"}>
          {u.status === "active" ? "Aktif" : "Pasif"}
        </Badge>
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewUser(u.id); }}>
          <Eye size={16} />
          Detay
        </Button>
      </div>
    </div>
  );

  // Yeni kullanıcı ekleme butonuna tıklanınca modalı aç
  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  // Yeni kullanıcı oluşturma fonksiyonu
  const handleCreateUser = async (userData: {
    fullName: FormDataEntryValue | null;
    username: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    phone: FormDataEntryValue | null;
    role: FormDataEntryValue | null;
    commission: number;
  }) => {
    try {
      // API URL'sini doğru şekilde yapılandır
      const apiUrl = new URL('/api/users', window.location.origin);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: userData.fullName?.toString(),
          username: userData.username?.toString(),
          password: userData.password?.toString(),
          email: userData.email?.toString(),
          phone: userData.phone?.toString(),
          role: userData.role?.toString(),
          commission: userData.commission
        }),
      });

      // İlk olarak response type'ı kontrol et
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`Geçersiz API yanıtı: ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kullanıcı oluşturma başarısız');
      }

      // Başarılı yanıt - kullanıcıyı ekle ve modalı kapat
      setUsers((prev) => [...prev, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      alert(error instanceof Error ? error.message : 'Bir hata oluştu.');
    }
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Prim"
            value={`${stats.totalRevenue.toLocaleString("tr-TR")} ₺`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Toplam Poliçe"
            value={stats.totalPolicies}
            icon={FileText}
          />
          <StatsCard
            title="Toplam Komisyon"
            value={`${stats.totalCommission.toLocaleString("tr-TR")} ₺`}
            icon={Shield}
          />
          <StatsCard
            title="Ortalama Poliçe"
            value={`${stats.avgPolicy.toLocaleString("tr-TR")} ₺`}
            icon={User}
          />
        </div>

        {/* Filtreler ve Arama */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Kullanıcı Yönetimi</CardTitle>
              <Button onClick={handleAddUser}>
                <Plus size={18} />
                Yeni Kullanıcı
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tüm Roller</option>
                <option value="admin">Yönetici</option>
                <option value="branch">Şube</option>
                <option value="user">Kullanıcı</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </CardContent>
        </Card>

  {/* Yöneticiler */}
        {adminUsers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Yöneticiler</h2>
              <Badge variant="danger">{adminUsers.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminUsers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          </div>
        )}

        {/* Şube Kullanıcıları */}
        {branchUsers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Şube Kullanıcıları</h2>
              <Badge variant="info">{branchUsers.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchUsers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          </div>
        )}

        {/* Normal Kullanıcılar */}
        {regularUsers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="text-gray-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Kullanıcılar</h2>
              <Badge variant="default">{regularUsers.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularUsers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          </div>
        )}

        {/* Kullanıcı Ekleme Modal */}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Kullanıcı Ekle">
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateUser({
                fullName: formData.get('fullName'),
                username: formData.get('username'),
                password: formData.get('password'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                role: formData.get('role'),
                commission: Number(formData.get('commission')) || 0,
              });
            }}
          >
            <Input label="Ad Soyad" name="fullName" placeholder="Kullanıcının tam adı" required />
            <Input label="Kullanıcı Adı" name="username" placeholder="kullanici_adi" required />
            <Input label="E-posta" name="email" type="email" placeholder="ornek@esigorta.com" required />
            <Input label="Şifre" name="password" type="password" placeholder="********" required />
            <Input label="Telefon" name="phone" placeholder="+90 5XX XXX XX XX" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select 
                name="role"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="user">Kullanıcı</option>
                <option value="branch">Şube</option>
                <option value="admin">Yönetici</option>
              </select>
            </div>
            <Input label="Komisyon Oranı (%)" name="commission" type="number" placeholder="15" min="0" max="100" step="0.5" />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                İptal
              </Button>
              <Button type="submit" className="flex-1">
                Oluştur
              </Button>
            </div>
          </form>
        </Modal>
      </div>
  </ProfessionalLayout>
  );
}




import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { apiService } from "@/services/api";
import {
  User,
  FileText,
  Download,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Eye,
} from "lucide-react";

interface UserOperation {
  id: number;
  user_id: string;
  user_name: string;
  giris_kanali: string;
  urun: string;
  tutar: string;
  plaka?: string;
  musteri_ad: string;
  tarih: string;
  yenileme: boolean;
  pdf_file: string;
}

interface User {
  user_id: string;
  user_name: string;
  police_sayisi: number;
  toplam_tutar: number;
  son_islem: string;
}

export default function UserOperationsPage() {
  const router = useRouter();
  const [operations, setOperations] = useState<UserOperation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operationsData, usersData] = await Promise.all([
          apiService.getUserOperations(),
          apiService.getUsers(),
        ]);

        setOperations(operationsData.operations || []);
        setUsers(usersData.users || []);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Kullanıcıya göre filtrele
  useEffect(() => {
    if (selectedUser === "all") return;

    const fetchUserOperations = async () => {
      try {
        const data = await apiService.getUserOperations(selectedUser);
        setOperations(data.operations || []);
      } catch (error) {
        console.error("Kullanıcı işlemleri hatası:", error);
      }
    };

    fetchUserOperations();
  }, [selectedUser]);

  // Filtrelenmiş işlemler
  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.musteri_ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.plaka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.user_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getUrunBadge = (urun: string) => {
    const colors = {
      trafik: "bg-blue-100 text-blue-800",
      kasko: "bg-purple-100 text-purple-800",
      seyahat: "bg-green-100 text-green-800",
      saglik: "bg-red-100 text-red-800",
      konut: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge
        className={
          colors[urun as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {urun.toUpperCase()}
      </Badge>
    );
  };

  const getGirisKanaliBadge = (kanal: string) => {
    const colors = {
      panel: "bg-blue-100 text-blue-800",
      web: "bg-green-100 text-green-800",
      mobile: "bg-purple-100 text-purple-800",
      api: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge
        className={
          colors[kanal as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {kanal.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Kullanıcı işlemleri yükleniyor...
            </p>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kullanıcı İşlemleri
            </h1>
            <p className="text-gray-600 mt-1">
              Kim hangi girişten hangi poliçeyi kesmiş
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")}>
            Dashboard'a Dön
          </Button>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam Poliçe
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam Tutar
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operations
                      .reduce((sum, op) => {
                        const tutar = parseFloat(
                          op.tutar.replace(",", ".").replace(" TL", "")
                        );
                        return sum + (isNaN(tutar) ? 0 : tutar);
                      }, 0)
                      .toLocaleString("tr-TR")}{" "}
                    ₺
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aktif Kullanıcı
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bugün
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      operations.filter(
                        (op) =>
                          new Date(op.tarih).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtreler */}
        <Card>
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Müşteri adı, plaka veya kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tüm Kullanıcılar</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.user_name} ({user.police_sayisi} poliçe)
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* İşlemler Tablosu */}
        <Card>
          <CardHeader>
            <CardTitle>
              İşlem Listesi ({filteredOperations.length} kayıt)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Giriş Kanalı</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Plaka</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white text-xs font-bold">
                            {op.user_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {op.user_name}
                          </p>
                          <p className="text-xs text-gray-500">{op.user_id}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getGirisKanaliBadge(op.giris_kanali)}
                    </TableCell>

                    <TableCell>{getUrunBadge(op.urun)}</TableCell>

                    <TableCell>
                      <p className="font-medium text-gray-900">
                        {op.musteri_ad}
                      </p>
                    </TableCell>

                    <TableCell>
                      {op.plaka ? (
                        <Badge variant="outline">{op.plaka}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <p className="font-bold text-green-600">{op.tutar}</p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-gray-600">{op.tarih}</p>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => apiService.downloadPolicyPDF(op.id)}
                        >
                          <Download size={14} />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/admin/users/${op.user_id}`)
                          }
                        >
                          <Eye size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredOperations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-lg font-medium text-gray-900 mb-2">
                İşlem bulunamadı
              </p>
              <p className="text-sm text-gray-600">
                Arama kriterlerinize uygun işlem bulunamadı.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProfessionalLayout>
  );
}

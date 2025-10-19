import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Log {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  user: string;
  action: string;
}

export default function LogsPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [logs] = useState<Log[]>([
    { id: "1", timestamp: "2024-03-15 16:45:23", level: "success", message: "Kasko teklifi başarıyla oluşturuldu", user: "sube", action: "CREATE_QUOTE" },
    { id: "2", timestamp: "2024-03-15 16:40:11", level: "info", message: "Kullanıcı giriş yaptı", user: "admin", action: "LOGIN" },
    { id: "3", timestamp: "2024-03-15 16:35:45", level: "warning", message: "API timeout - Sompo Sigorta", user: "system", action: "API_TIMEOUT" },
    { id: "4", timestamp: "2024-03-15 16:30:22", level: "error", message: "Teklif oluşturma başarısız - Anadolu Sigorta", user: "sube", action: "QUOTE_FAILED" },
    { id: "5", timestamp: "2024-03-15 16:25:10", level: "success", message: "Trafik teklifi başarıyla oluşturuldu", user: "sube", action: "CREATE_QUOTE" },
    { id: "6", timestamp: "2024-03-15 16:20:33", level: "info", message: "Kullanıcı çıkış yaptı", user: "kullanici1", action: "LOGOUT" },
    { id: "7", timestamp: "2024-03-15 16:15:55", level: "warning", message: "Yüksek API kullanımı tespit edildi", user: "system", action: "HIGH_USAGE" },
    { id: "8", timestamp: "2024-03-15 16:10:18", level: "success", message: "Yeni kullanıcı oluşturuldu", user: "admin", action: "CREATE_USER" },
  ]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: Log["level"]) => {
    switch (level) {
      case "success":
          return <Badge variant="success">Başarılı</Badge>;
      case "info":
        return <Badge variant="info">Bilgi</Badge>;
      case "warning":
          return <Badge variant="warning">Uyarı</Badge>;
      case "error":
        return <Badge variant="danger">Hata</Badge>;
    }
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistem Logları</h1>
            <p className="text-gray-600 mt-1">Sistem aktivitelerini takip edin</p>
          </div>
          <Button>
            <Download size={18} />
              Logları İndir
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Log ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tüm Seviyeler</option>
                <option value="success">Başarılı</option>
                <option value="info">Bilgi</option>
                <option value="warning">Uyarı</option>
                <option value="error">Hata</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Seviye</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Aksiyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell className="max-w-md">{log.message}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{log.action}</code>
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



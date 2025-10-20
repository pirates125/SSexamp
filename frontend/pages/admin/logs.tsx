import { useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Search, Download, FileText, Database } from "lucide-react";
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
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    info: 0,
    warning: 0,
    error: 0,
  });

  // Log verilerini çek
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/logs?level=${filterLevel}&search=${searchTerm}`
      );
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setStats(
          data.stats || { total: 0, success: 0, info: 0, warning: 0, error: 0 }
        );
      }
    } catch (error) {
      console.error("Log verileri alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  }, [filterLevel, searchTerm]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    } else if (user && user.role === "admin") {
      fetchLogs();
    }
  }, [user, isLoading, router, filterLevel, searchTerm, fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === "all" || log.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: Log["level"]) => {
    switch (level) {
      case "success":
        return <Badge variant="success">Başarılı</Badge>;
      case "warning":
        return <Badge variant="warning">Uyarı</Badge>;
      case "error":
        return <Badge variant="danger">Hata</Badge>;
      case "info":
      default:
        return <Badge variant="info">Bilgi</Badge>;
    }
  };

  // Export fonksiyonları
  const exportToCSV = () => {
    const csvContent = [
      "Zaman,Seviye,Mesaj,Kullanıcı,Aksiyon",
      ...filteredLogs.map(
        (log) =>
          `"${log.timestamp}","${log.level}","${log.message}","${log.user}","${log.action}"`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `logs-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `logs-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToTXT = () => {
    const txtContent = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message} (${
            log.user
          } - ${log.action})`
      )
      .join("\n");
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `logs-${new Date().toISOString().split("T")[0]}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistem Logları</h1>
            <p className="text-gray-600 mt-1">
              Sistem aktivitelerini ve hatalarını takip edin
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <FileText size={16} />
              CSV
            </Button>
            <Button variant="outline" onClick={exportToJSON}>
              <Database size={16} />
              JSON
            </Button>
            <Button variant="outline" onClick={exportToTXT}>
              <Download size={16} />
              TXT
            </Button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toplam
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Başarılı
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.success}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Database className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bilgi
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.info}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uyarı
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.warning}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Search className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hata
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.error}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <Download className="text-red-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtreler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Log Filtreleri</h2>
              <Button onClick={fetchLogs} disabled={loading}>
                <Search size={16} />
                Yenile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
          </CardContent>
        </Card>

        {/* Log Tablosu */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Sistem Logları ({filteredLogs.length})
            </h2>
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
                {loading ? (
                  <TableRow>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Search size={20} className="animate-spin" />
                        <span>Log verileri yükleniyor...</span>
                      </div>
                    </td>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Log bulunamadı
                    </td>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>{getLevelBadge(log.level)}</TableCell>
                      <TableCell className="max-w-md">{log.message}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.action}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProfessionalLayout>
  );
}

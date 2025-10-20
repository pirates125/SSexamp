import { useState, useContext } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Car, User, AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { apiService } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

export default function TrafikPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [useScraper, setUseScraper] = useState(false);
  const [form, setForm] = useState({
    bireysel: true,
    tc: "",
    ad: "",
    soyad: "",
    cep: "",
    email: "",
    plaka: "",
    tescilSeri: "",
    tescilNo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleScraperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Backend scraper API'sine istek at
      const response = await fetch(
        "http://localhost:8000/api/scraper/trafik-quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plaka: form.plaka,
            tescilSeri: form.tescilSeri,
            tescilNo: form.tescilNo,
            modelYear: 2020, // Varsayılan
            brand: "Toyota", // Varsayılan
            model: "Corolla", // Varsayılan
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(`✅ Scraper ile ${data.total_quotes} teklif bulundu!`);

        // Başarılı olursa dashboard'a yönlendir
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        throw new Error("Scraper API hatası");
      }
    } catch (error) {
      setError("Scraper ile teklif çekme sırasında bir hata oluştu");
      console.error("Scraper hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (useRealAPI) {
        // Gerçek API çağrısı (Sompo Provider)
        console.log("🚀 Gerçek API ile teklif alınıyor...");

        try {
          const quotes = await apiService.getTrafikQuote({
            tc: form.tc,
            ad: form.ad,
            soyad: form.soyad,
            cep: form.cep,
            email: form.email,
            plaka: form.plaka,
            tescilSeri: form.tescilSeri,
            tescilNo: form.tescilNo,
            bireysel: form.bireysel,
          });

          // Başarılı - teklifleri göster
          router.push({
            pathname: "/fiyatlar",
            query: {
              type: "trafik",
              realData: "true",
              quotes: JSON.stringify(quotes),
              ...form,
            },
          });
        } catch (apiError) {
          // Backend çalışmıyorsa bilgilendirici hata
          setError(
            "Backend API'ye bağlanılamadı! " +
              "Lütfen backend'i başlatın: " +
              "1) start_backend.bat dosyasını çalıştırın veya " +
              "2) 'python -m src.api.main' komutunu çalıştırın. " +
              "Detay: " +
              (apiError instanceof Error ? apiError.message : "Bilinmeyen hata")
          );
          console.error("API Hatası:", apiError);
          return;
        }
      } else {
        // Mock data ile devam (eski yöntem)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push({
          pathname: "/fiyatlar",
          query: { type: "trafik", ...form },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Teklif alınırken hata oluştu"
      );
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (company: string, amount: number) => {
    if (!user) {
      setError("Kullanıcı bilgisi bulunamadı");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.username,
          userRole: user.role,
          policyType: "trafik",
          company: company,
          amount: amount,
          customerInfo: {
            name: `${form.ad} ${form.soyad}`,
            tcKimlik: form.tc,
            phone: form.cep,
            email: form.email,
            address: "Adres bilgisi",
          },
          policyDetails: {
            plaka: form.plaka,
            tescilSeri: form.tescilSeri,
            tescilNo: form.tescilNo,
            bireysel: form.bireysel,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Poliçe başarıyla kesildi! Poliçe No: ${data.policy.id}`);

        // 3 saniye sonra dashboard'a yönlendir
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        throw new Error("Poliçe kesme başarısız");
      }
    } catch (error) {
      setError("Poliçe kesme sırasında bir hata oluştu");
      console.error("Poliçe kesme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Trafik Sigortası Teklifi
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Aracınız için en uygun trafik sigortası teklifini alın
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRealAPI}
                    onChange={(e) => setUseRealAPI(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {useRealAPI ? "🚀 Gerçek API (Sompo)" : "🎭 Mock Data"}
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useScraper}
                    onChange={(e) => setUseScraper(e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {useScraper ? "🕷️ Web Scraper" : "📊 Normal API"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-destructive mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-destructive">
                    Hata Oluştu
                  </h3>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {useRealAPI && (
          <Card className="border-info/20 bg-info/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-info mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-info">Gerçek API Aktif</h3>
                  <p className="text-sm text-info/80 mt-1">
                    Sompo Sigorta provider'ı kullanılarak gerçek teklif
                    alınacak. Bu işlem 30-60 saniye sürebilir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form
          onSubmit={useScraper ? handleScraperSubmit : handleSubmit}
          className="space-y-6"
        >
          {/* Sigortalı Bilgileri */}
          <Card className="border border-border shadow-modern-md hover:shadow-modern-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <User className="text-blue-600 dark:text-blue-400" size={20} />
                <CardTitle className="text-gray-900 dark:text-white font-bold">
                  Sigortalı Bilgileri
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sigortalı Tipi
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bireysel"
                      checked={form.bireysel}
                      onChange={() => setForm({ ...form, bireysel: true })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Bireysel
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bireysel"
                      checked={!form.bireysel}
                      onChange={() => setForm({ ...form, bireysel: false })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Kurumsal
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="TC / Y. Kimlik No"
                  name="tc"
                  value={form.tc}
                  onChange={handleChange}
                  placeholder="11 haneli kimlik numarası"
                  required
                />
                <Input
                  label="Ad"
                  name="ad"
                  value={form.ad}
                  onChange={handleChange}
                  placeholder="Adınız"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Soyad"
                  name="soyad"
                  value={form.soyad}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  required
                />
                <Input
                  label="Cep Telefonu"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  placeholder="5XX XXX XX XX"
                  required
                />
              </div>

              <Input
                label="E-posta (Opsiyonel)"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
              />
            </CardContent>
          </Card>

          {/* Araç Bilgileri */}
          <Card className="border border-border shadow-modern-md hover:shadow-modern-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Car className="text-green-600 dark:text-green-400" size={20} />
                <CardTitle className="text-gray-900 dark:text-white font-bold">
                  Araç Bilgileri
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Araç Plakası"
                name="plaka"
                value={form.plaka}
                onChange={handleChange}
                placeholder="34ABC123"
                className="uppercase"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tescil Seri Kodu"
                  name="tescilSeri"
                  value={form.tescilSeri}
                  onChange={handleChange}
                  placeholder="ABC12345"
                  required
                />
                <Input
                  label="Tescil / ASBIS No"
                  name="tescilNo"
                  value={form.tescilNo}
                  onChange={handleChange}
                  placeholder="ASBIS numarasını giriniz"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
              className="px-6 py-3 border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              İptal
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {useRealAPI ? "Gerçek teklif alınıyor..." : "Hazırlanıyor..."}
                </>
              ) : (
                <>
                  <Car className="mr-2" size={18} />
                  {useRealAPI ? "🚀 Gerçek Teklif Al" : "Teklif Oluştur"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProfessionalLayout>
  );
}

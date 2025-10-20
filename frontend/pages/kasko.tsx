import { useState, useContext } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Car, User, Phone, Mail, AlertCircle } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function KaskoPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [useScraper, setUseScraper] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    marka: "",
    model: "",
    modelYili: "",
    kaskoTipi: "kasko",
    imm: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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
        "http://localhost:8000/api/scraper/kasko-quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plaka: form.plaka,
            tescilSeri: form.tescilSeri,
            tescilNo: form.tescilNo,
            modelYear: parseInt(form.modelYili) || 2020,
            brand: form.marka || "Toyota",
            model: form.model || "Corolla",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(
          `✅ Scraper ile ${data.total_quotes} kasko teklifi bulundu!`
        );

        // Başarılı olursa dashboard'a yönlendir
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        throw new Error("Scraper API hatası");
      }
    } catch (error) {
      setError("Scraper ile kasko teklifi çekme sırasında bir hata oluştu");
      console.error("Scraper hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simüle API çağrısı
    await new Promise((resolve) => setTimeout(resolve, 1500));

    router.push({
      pathname: "/fiyatlar",
      query: { type: "kasko", ...form },
    });
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Kasko Sigortası Teklifi
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Aracınız için en uygun kasko teklifini alın
              </p>
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

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-green-600 text-lg">✅</div>
                <div>
                  <h3 className="font-semibold text-green-800">Başarılı!</h3>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="text-primary" size={20} />
                </div>
                <CardTitle>Sigortalı Bilgileri</CardTitle>
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
                label="E-posta"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
              />
            </CardContent>
          </Card>

          {/* Araç Bilgileri */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Car className="text-blue-600" size={20} />
                <CardTitle>Araç Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Araç Plakası"
                  name="plaka"
                  value={form.plaka}
                  onChange={handleChange}
                  placeholder="34ABC123"
                  className="uppercase"
                  required
                />
                <Input
                  label="Tescil Seri Kodu"
                  name="tescilSeri"
                  value={form.tescilSeri}
                  onChange={handleChange}
                  placeholder="ABC12345"
                  required
                />
              </div>

              <Input
                label="Tescil / ASBIS No"
                name="tescilNo"
                value={form.tescilNo}
                onChange={handleChange}
                placeholder="ASBIS numarasını giriniz"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Marka"
                  name="marka"
                  value={form.marka}
                  onChange={handleChange}
                  placeholder="Örn: Toyota"
                  required
                />
                <Input
                  label="Model"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Örn: Corolla"
                  required
                />
                <Input
                  label="Model Yılı"
                  name="modelYili"
                  type="number"
                  value={form.modelYili}
                  onChange={handleChange}
                  placeholder="2023"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kasko Tipi
                </label>
                <select
                  name="kaskoTipi"
                  value={form.kaskoTipi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="kasko">Kasko</option>
                  <option value="mini-kasko">Mini Kasko</option>
                  <option value="tam-kasko">Tam Kasko</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="imm"
                  checked={form.imm}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  İMM (İhtiyari Mali Mesuliyet) ekle
                </span>
              </label>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              İptal
            </Button>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Teklifler hazırlanıyor..." : "Teklif Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </ProfessionalLayout>
  );
}

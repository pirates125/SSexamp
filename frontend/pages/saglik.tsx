import { useState, useContext } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Heart, User, AlertCircle } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function SaglikPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [useScraper, setUseScraper] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    tc: "",
    ad: "",
    soyad: "",
    dogumTarihi: "",
    cep: "",
    email: "",
    cinsiyet: "erkek",
    kronikHastalik: false,
    sigara: false,
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
        "http://localhost:8000/api/scraper/saglik-quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: 2024 - new Date(form.dogumTarihi).getFullYear() || 30,
            gender: form.cinsiyet,
            smoking: form.sigara,
            chronicDisease: form.kronikHastalik,
            coverageType: "comprehensive",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(
          `✅ Scraper ile ${data.total_quotes} sağlık teklifi bulundu!`
        );

        // Başarılı olursa dashboard'a yönlendir
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        throw new Error("Scraper API hatası");
      }
    } catch (error) {
      setError("Scraper ile sağlık teklifi çekme sırasında bir hata oluştu");
      console.error("Scraper hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push({ pathname: "/fiyatlar", query: { type: "saglik", ...form } });
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Sağlık Sigortası Teklifi
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Sağlığınız için kapsamlı sigorta teklifi alın
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                <CardTitle className="text-gray-900 dark:text-white">
                  Kişisel Bilgiler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="TC Kimlik No"
                  name="tc"
                  value={form.tc}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Ad"
                  name="ad"
                  value={form.ad}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Soyad"
                  name="soyad"
                  value={form.soyad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Doğum Tarihi"
                  type="date"
                  name="dogumTarihi"
                  value={form.dogumTarihi}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cinsiyet
                  </label>
                  <select
                    name="cinsiyet"
                    value={form.cinsiyet}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="erkek">Erkek</option>
                    <option value="kadin">Kadın</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cep Telefonu"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="E-posta"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="text-blue-600" size={20} />
                <CardTitle>Sağlık Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="kronikHastalik"
                  checked={form.kronikHastalik}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  Kronik hastalığım var
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="sigara"
                  checked={form.sigara}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  Sigara kullanıyorum
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

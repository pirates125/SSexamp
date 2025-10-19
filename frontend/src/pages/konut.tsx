import { useState } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Home, User } from "lucide-react";

export default function KonutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tc: "",
    ad: "",
    soyad: "",
    cep: "",
    email: "",
    adres: "",
    il: "",
    ilce: "",
    binaYasi: "",
    metrekare: "",
    yapiTipi: "betonarme",
    kat: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push({ pathname: "/fiyatlar", query: { type: "konut", ...form } });
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto space-y-8 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Konut Sigortası Teklifi
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Eviniz için kapsamlı sigorta teklifi alın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                <CardTitle className="text-gray-900 dark:text-white">
                  Sigortalı Bilgileri
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
                <Home className="text-blue-600" size={20} />
                <CardTitle>Konut Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Adres"
                name="adres"
                value={form.adres}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="İl"
                  name="il"
                  value={form.il}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="İlçe"
                  name="ilce"
                  value={form.ilce}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Bina Yaşı"
                  type="number"
                  name="binaYasi"
                  value={form.binaYasi}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Metrekare"
                  type="number"
                  name="metrekare"
                  value={form.metrekare}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Kat"
                  type="number"
                  name="kat"
                  value={form.kat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yapı Tipi
                </label>
                <select
                  name="yapiTipi"
                  value={form.yapiTipi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="betonarme">Betonarme</option>
                  <option value="kagir">Kâgir</option>
                  <option value="ahsap">Ahşap</option>
                  <option value="celik">Çelik</option>
                </select>
              </div>
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

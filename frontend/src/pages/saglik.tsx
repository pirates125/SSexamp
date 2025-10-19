import { useState } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Heart, User } from "lucide-react";

export default function SaglikPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push({ pathname: "/fiyatlar", query: { type: "saglik", ...form } });
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-6xl mx-auto space-y-8 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Sağlık Sigortası Teklifi
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Sağlığınız için kapsamlı sigorta teklifi alın
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

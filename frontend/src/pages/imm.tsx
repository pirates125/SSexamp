import { useState } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, User, Car } from "lucide-react";

export default function IMMPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tc: "",
    ad: "",
    soyad: "",
    cep: "",
    email: "",
    plaka: "",
    tescilSeri: "",
    tescilNo: "",
    teminatLimiti: "100000",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push({ pathname: "/fiyatlar", query: { type: "imm", ...form } });
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">İMM Sigortası Teklifi</h1>
          <p className="text-gray-600 mt-1">İhtiyari Mali Mesuliyet sigortası teklifi alın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                <CardTitle>Sigortalı Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="TC Kimlik No" name="tc" value={form.tc} onChange={handleChange} required />
                <Input label="Ad" name="ad" value={form.ad} onChange={handleChange} required />
                <Input label="Soyad" name="soyad" value={form.soyad} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Cep Telefonu" name="cep" value={form.cep} onChange={handleChange} required />
                <Input label="E-posta" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Car className="text-blue-600" size={20} />
                <CardTitle>Araç Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Araç Plakası" name="plaka" value={form.plaka} onChange={handleChange} className="uppercase" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Tescil Seri Kodu" name="tescilSeri" value={form.tescilSeri} onChange={handleChange} required />
                <Input label="Tescil / ASBIS No" name="tescilNo" value={form.tescilNo} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                <CardTitle>Teminat Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teminat Limiti</label>
                <select name="teminatLimiti" value={form.teminatLimiti} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="100000">100.000 TL</option>
                  <option value="200000">200.000 TL</option>
                  <option value="300000">300.000 TL</option>
                  <option value="500000">500.000 TL</option>
                  <option value="1000000">1.000.000 TL</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>İptal</Button>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Teklifler hazırlanıyor..." : "Teklif Oluştur"}
            </Button>
          </div>
        </form>
      </div>
  </ProfessionalLayout>
  );
}



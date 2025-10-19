import { useState } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Activity, User } from "lucide-react";

export default function TamamlayiciPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tc: "",
    ad: "",
    soyad: "",
    dogumTarihi: "",
    cep: "",
    email: "",
    sgkNo: "",
    meslek: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push({ pathname: "/fiyatlar", query: { type: "tamamlayici", ...form } });
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tamamlayıcı Sağlık Sigortası</h1>
          <p className="text-gray-600 mt-1">SGK'ya ek tamamlayıcı sağlık sigortası teklifi alın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                <CardTitle>Kişisel Bilgiler</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="TC Kimlik No" name="tc" value={form.tc} onChange={handleChange} required />
                <Input label="Ad" name="ad" value={form.ad} onChange={handleChange} required />
                <Input label="Soyad" name="soyad" value={form.soyad} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Doğum Tarihi" type="date" name="dogumTarihi" value={form.dogumTarihi} onChange={handleChange} required />
                <Input label="SGK No" name="sgkNo" value={form.sgkNo} onChange={handleChange} required />
              </div>
              <Input label="Meslek" name="meslek" value={form.meslek} onChange={handleChange} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Cep Telefonu" name="cep" value={form.cep} onChange={handleChange} required />
                <Input label="E-posta" type="email" name="email" value={form.email} onChange={handleChange} />
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



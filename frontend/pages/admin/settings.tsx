import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [settings, setSettings] = useState({
    companyName: "EESİGORTA",
    companyEmail: "info@esigorta.com",
    companyPhone: "+90 (212) 555 0000",
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    apiTimeout: "30",
    maxRetries: "3",
    cacheExpiration: "60",
  });
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ayarlar kaydedildi!");
  };

  return (
  <ProfessionalLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600 mt-1">Sistem genelinde ayarları yapılandırın</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Şirket Adı"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
              />
              <Input
                label="E-posta"
                type="email"
                name="companyEmail"
                value={settings.companyEmail}
                onChange={handleChange}
              />
              <Input
                label="Telefon"
                name="companyPhone"
                value={settings.companyPhone}
                onChange={handleChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-posta Ayarları (SMTP)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SMTP Sunucusu"
                  name="smtpServer"
                  value={settings.smtpServer}
                  onChange={handleChange}
                />
                <Input
                  label="Port"
                  name="smtpPort"
                  value={settings.smtpPort}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="Kullanıcı Adı"
                name="smtpUsername"
                value={settings.smtpUsername}
                onChange={handleChange}
              />
              <Input
                label="Şifre"
                type="password"
                name="smtpPassword"
                value={settings.smtpPassword}
                onChange={handleChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Timeout (saniye)"
                  type="number"
                  name="apiTimeout"
                  value={settings.apiTimeout}
                  onChange={handleChange}
                />
                <Input
                  label="Max Deneme"
                  type="number"
                  name="maxRetries"
                  value={settings.maxRetries}
                  onChange={handleChange}
                />
                <Input
                  label="Cache (dakika)"
                  type="number"
                  name="cacheExpiration"
                  value={settings.cacheExpiration}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save size={18} />
              Ayarları Kaydet
            </Button>
          </div>
        </form>
      </div>
  </ProfessionalLayout>
  );
}



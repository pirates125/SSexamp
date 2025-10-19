import { useState, useContext, FormEvent } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, User, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Kullanıcı adı veya şifre hatalı");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Sol Taraf - Logo ve Bilgi */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={48} className="text-white" />
            <h1 className="text-5xl font-bold tracking-wide">EESİGORTA</h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Sigorta Yönetim Sistemi
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Tüm sigorta şirketlerinden anlık teklif alın, karşılaştırın ve
            müşterilerinize en iyi hizmeti sunun.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Hızlı Teklif</h3>
                <p className="text-blue-100 text-sm">8+ sigorta şirketinden anlık teklif</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Kolay Yönetim</h3>
                <p className="text-blue-100 text-sm">Kullanıcı dostu arayüz</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-2 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Güvenli Sistem</h3>
                <p className="text-blue-100 text-sm">Verileriniz güvende</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Login Formu */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h2>
              <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600" size={18} />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>     
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} EESİGORTA. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


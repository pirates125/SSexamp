import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProfessionalLayout from "@/components/ProfessionalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Download,
  TrendingDown,
  CreditCard,
  Wallet,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { apiService } from "@/services/api";

interface Quote {
  company: string;
  logo: string;
  price: number | null;
  priceInstallment?: number | null;
  installmentCount?: number;
  status: "loading" | "success" | "error";
  features: string[];
  discounts?: string[];
  isRealData?: boolean; // Gerçek API'den gelen veri mi?
  errorMessage?: string;
}

export default function FiyatlarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [paymentType, setPaymentType] = useState<"cash" | "installment">(
    "cash"
  );
  const INITIAL_QUOTES: Quote[] = [
    {
      company: "Anadolu Sigorta",
      logo: "/company-logos/anadolu.png",
      price: null,
      priceInstallment: null,
      installmentCount: 8,
      status: "loading",
      features: ["7/24 Yol Yardım", "Deprem Teminatı", "Cam Hasarı"],
    },
    {
      company: "Sompo Sigorta",
      logo: "/company-logos/sompo.png",
      price: null,
      priceInstallment: null,
      installmentCount: 9,
      status: "loading",
      features: ["Yol Yardım", "Mini Onarım", "İkame Araç"],
    },
    {
      company: "Atlas Sigorta",
      logo: "/company-logos/atlas.png",
      price: null,
      priceInstallment: null,
      installmentCount: 8,
      status: "loading",
      features: ["Kaza Teminatı", "Çalınma", "Yangın"],
    },
    {
      company: "Koru Sigorta",
      logo: "/company-logos/koru.png",
      price: null,
      priceInstallment: null,
      installmentCount: 6,
      status: "loading",
      features: ["Temel Teminat", "Yol Yardım"],
    },
    {
      company: "Quick Sigorta",
      logo: "/company-logos/quick.png",
      price: null,
      priceInstallment: null,
      installmentCount: 9,
      status: "loading",
      features: ["Hızlı Hasar", "Online İşlem", "7/24 Destek"],
    },
    {
      company: "Doğa Sigorta",
      logo: "/company-logos/doga.png",
      price: null,
      priceInstallment: null,
      installmentCount: 8,
      status: "loading",
      features: ["Doğal Afet", "Yol Yardım", "Cam Teminatı"],
    },
    {
      company: "Şeker Sigorta",
      logo: "/company-logos/seker.png",
      price: null,
      priceInstallment: null,
      installmentCount: 6,
      status: "loading",
      features: ["Temel Teminat", "Deprem"],
    },
  ];

  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (useRealAPI) {
        // Gerçek API'den veri çek
        try {
          const formData = router.query;
          const response = await apiService.getTrafikQuote({
            plaka: (formData.plaka as string) || "34ABC123",
            tcKimlik: (formData.tcKimlik as string) || "12345678901",
            telefon: (formData.telefon as string) || "05551234567",
            email: (formData.email as string) || "test@example.com",
            adres: (formData.adres as string) || "Test Adres",
            kullanim: (formData.kullanim as string) || "hususi",
            kaskoDurumu: (formData.kaskoDurumu as string) || "var",
            hasarDurumu: (formData.hasarDurumu as string) || "yok",
            user_id: "1",
            user_name: "Test User",
            giris_kanali: "web",
            musteri_ad: "Test Müşteri",
            use_real_api: true,
          });

          // API'den gelen verileri işle
          setQuotes((prev) =>
            prev.map((q) => {
              if (q.company === "Sompo Sigorta" && response.sompo) {
                return {
                  ...q,
                  status: "success",
                  price: response.sompo.fiyat,
                  priceInstallment: Math.floor(response.sompo.fiyat * 1.15),
                  isRealData: true,
                  discounts: ["Gerçek API Verisi"],
                };
              }
              if (q.company === "Quick Sigorta" && response.quick) {
                return {
                  ...q,
                  status: "success",
                  price: response.quick.fiyat,
                  priceInstallment: Math.floor(response.quick.fiyat * 1.15),
                  isRealData: true,
                  discounts: ["Gerçek API Verisi"],
                };
              }
              return q;
            })
          );
        } catch (error) {
          console.error("API Error:", error);
          // Hata durumunda mock veriye geç
          setUseRealAPI(false);
        }
      } else {
        // Mock veri simülasyonu
        const delays = [1000, 1500, 2000, 2500, 3000, 3500, 4000];
        const initial = INITIAL_QUOTES;

        initial.forEach((quote, index) => {
          setTimeout(() => {
            setQuotes((prev) =>
              prev.map((q, i) => {
                if (i === index) {
                  const success = Math.random() > 0.2;
                  const basePrice = Math.floor(Math.random() * 3000) + 1500;
                  const installmentPrice = Math.floor(basePrice * 1.15);
                  return {
                    ...q,
                    status: success ? "success" : "error",
                    price: success ? basePrice : null,
                    priceInstallment: success ? installmentPrice : null,
                    discounts: success
                      ? ["Mock Veri", "Simülasyon"]
                      : undefined,
                    isRealData: false,
                    errorMessage: success ? undefined : "Mock hata simülasyonu",
                  };
                }
                return q;
              })
            );
          }, delays[index]);
        });
      }

      setTimeout(() => setLoading(false), 4500);
    };

    fetchQuotes();
  }, [useRealAPI, router.query]);

  const successfulQuotes = quotes.filter(
    (q) => q.status === "success" && q.price
  );
  const lowestPrice =
    successfulQuotes.length > 0
      ? Math.min(
          ...successfulQuotes.map((q) =>
            paymentType === "cash" ? q.price || 0 : q.priceInstallment || 0
          )
        )
      : 0;

  const getPrice = (quote: Quote) => {
    return paymentType === "cash" ? quote.price : quote.priceInstallment;
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-7xl mx-auto space-y-8 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Teklif Karşılaştırması
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {router.query.type === "kasko" ? "Kasko" : "Trafik"} sigortası
              teklifleri
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft size={18} />
              Geri
            </Button>
            <Button
              variant="primary"
              disabled={successfulQuotes.length === 0}
              onClick={() => {
                if (successfulQuotes.length > 0) {
                  // PDF indirme işlemi
                  console.log("PDF indiriliyor...");
                }
              }}
            >
              <Download size={18} />
              PDF İndir
            </Button>
          </div>
        </div>

        {/* API Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground mb-1">
                  Veri Kaynağı
                </h3>
                <p className="text-sm text-muted-foreground">
                  {useRealAPI
                    ? "Gerçek API verileri kullanılıyor"
                    : "Mock veriler kullanılıyor"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {useRealAPI ? "Gerçek API" : "Mock Veri"}
                </span>
                <Button
                  variant={useRealAPI ? "primary" : "outline"}
                  onClick={() => {
                    setUseRealAPI(!useRealAPI);
                    setLoading(true);
                    setQuotes(INITIAL_QUOTES);
                  }}
                  disabled={loading}
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                  {useRealAPI ? "Gerçek API" : "Mock Veri"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ödeme Tipi Seçimi */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Ödeme Şekli
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Peşin veya taksitli ödeme seçenekleri
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={paymentType === "cash" ? "primary" : "outline"}
                  onClick={() => setPaymentType("cash")}
                >
                  <Wallet size={18} />
                  Peşin
                </Button>
                <Button
                  variant={
                    paymentType === "installment" ? "primary" : "outline"
                  }
                  onClick={() => setPaymentType("installment")}
                >
                  <CreditCard size={18} />
                  Taksitli
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Özet Bilgiler */}
        {!loading && successfulQuotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingDown className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      En Uygun Fiyat
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {lowestPrice.toLocaleString("tr-TR")} ₺
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {paymentType === "cash"
                        ? "Peşin"
                        : `${quotes[0]?.installmentCount || 9} Taksit`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alınan Teklif
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {successfulQuotes.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ortalama Fiyat
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {Math.floor(
                    successfulQuotes.reduce(
                      (acc, q) => acc + (getPrice(q) || 0),
                      0
                    ) / successfulQuotes.length
                  ).toLocaleString("tr-TR")}{" "}
                  ₺
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teklif Listesi - Tablo Formatı */}
        <Card>
          <CardHeader>
            <CardTitle>
              Teklif Listesi ({paymentType === "cash" ? "Peşin" : "Taksitli"})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">
                    {paymentType === "cash" ? "Peşin Fiyat" : "Taksit Tutarı"}
                  </TableHead>
                  {paymentType === "installment" && (
                    <TableHead className="text-center">Taksit</TableHead>
                  )}
                  <TableHead className="text-right">Toplam</TableHead>
                  <TableHead>Teminatlar</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote, index) => {
                  const currentPrice = getPrice(quote);
                  const isLowest =
                    currentPrice === lowestPrice && quote.status === "success";

                  return (
                    <TableRow
                      key={index}
                      className={
                        isLowest ? "bg-green-50 dark:bg-green-900/20" : ""
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={quote.logo}
                            alt={quote.company}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {quote.company}
                            </p>
                            {isLowest && (
                              <Badge variant="success" className="mt-1">
                                En Uygun
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {quote.status === "loading" && (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Hazırlanıyor...
                            </span>
                          </div>
                        )}
                        {quote.status === "success" && (
                          <Badge variant="success">Hazır</Badge>
                        )}
                        {quote.status === "error" && (
                          <Badge variant="danger">Alınamadı</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {quote.status === "success" && currentPrice ? (
                          <div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {paymentType === "cash"
                                ? `${currentPrice.toLocaleString("tr-TR")} ₺`
                                : `${Math.floor(
                                    currentPrice / (quote.installmentCount || 9)
                                  ).toLocaleString("tr-TR")} ₺`}
                            </p>
                            {quote.discounts && quote.discounts.length > 0 && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                İndirimli
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </TableCell>

                      {paymentType === "installment" && (
                        <TableCell className="text-center">
                          {quote.status === "success" ? (
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {quote.installmentCount}x
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              -
                            </span>
                          )}
                        </TableCell>
                      )}

                      <TableCell className="text-right">
                        {quote.status === "success" && currentPrice ? (
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {currentPrice.toLocaleString("tr-TR")} ₺
                            </p>
                            {paymentType === "installment" && quote.price && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Peşin: {quote.price.toLocaleString("tr-TR")} ₺
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {quote.status === "success" ? (
                          <div className="space-y-1">
                            {quote.features.slice(0, 2).map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"
                              >
                                <Check
                                  size={12}
                                  className="text-green-600 dark:text-green-400"
                                />
                                {feature}
                              </div>
                            ))}
                            {quote.features.length > 2 && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                +{quote.features.length - 2} teminat
                              </p>
                            )}
                          </div>
                        ) : quote.status === "loading" ? (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            Yükleniyor...
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {quote.status === "success" ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!quote.isRealData}
                              onClick={() => {
                                if (quote.isRealData) {
                                  console.log(
                                    `${quote.company} detayları gösteriliyor...`
                                  );
                                }
                              }}
                            >
                              Detaylar
                              {quote.isRealData && (
                                <Badge
                                  variant="success"
                                  className="ml-1 text-xs"
                                >
                                  Gerçek
                                </Badge>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              disabled={!quote.isRealData}
                              onClick={() => {
                                if (quote.isRealData) {
                                  console.log(
                                    `${quote.company} satın alma işlemi başlatılıyor...`
                                  );
                                }
                              }}
                            >
                              Satın Al
                              {quote.isRealData && (
                                <Badge
                                  variant="success"
                                  className="ml-1 text-xs"
                                >
                                  Aktif
                                </Badge>
                              )}
                            </Button>
                          </div>
                        ) : quote.status === "error" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Tekrar deneme işlemi
                              setQuotes((prev) =>
                                prev.map((q) =>
                                  q.company === quote.company
                                    ? { ...q, status: "loading" }
                                    : q
                                )
                              );
                              // Yeniden veri çekme işlemi burada yapılabilir
                            }}
                          >
                            <RefreshCw size={16} />
                            Tekrar Dene
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && successfulQuotes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Teklif alınamadı
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Hiçbir şirketten teklif alınamadı. Lütfen bilgilerinizi kontrol
                edip tekrar deneyin.
              </p>
              <Button onClick={() => router.back()}>Formu Düzenle</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProfessionalLayout>
  );
}

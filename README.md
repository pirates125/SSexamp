# 🏢 EESigorta - Sigorta Acentesi Web Uygulaması

Modern ve kullanıcı dostu sigorta acentesi web uygulaması. Web scraper teknolojisi ile gerçek zamanlı sigorta teklifleri alın, müşteri işlemlerini takip edin ve admin paneli ile yönetim yapın.

## 🚀 Özellikler

### 📊 Admin Dashboard

- **Gerçek Zamanlı İstatistikler**: Toplam gelir, komisyon, poliçe sayısı
- **Mesai Saati Kontrolü**: Quick Sigorta SMS durumu takibi
- **Acente İkonları**: Dark mode uyumlu şirket logoları
- **Modern UI/UX**: Responsive tasarım, hover efektleri

### 🔍 Sigorta Teklif Sistemi

- **Çoklu Şirket Desteği**: Sompo, Quick, Anadolu, Atlas, Koru, Doğa, Şeker
- **Gerçek API Entegrasyonu**: Web scraper ile canlı veri çekimi
- **Mock Veri Sistemi**: Test ve demo amaçlı simülasyon
- **Akıllı Buton Sistemi**: Sadece gerçek veriler geldiğinde aktif

### 📋 Sigorta Türleri

- **Trafik Sigortası**: Plaka, TC, iletişim bilgileri
- **Kasko Sigortası**: Araç detayları, model yılı
- **Konut Sigortası**: Adres, bina bilgileri
- **Sağlık Sigortası**: Kişisel bilgiler, teminat seçenekleri

### 🎨 Modern UI/UX

- **Dark/Light Mode**: Otomatik tema geçişi
- **Responsive Tasarım**: Mobil, tablet, desktop uyumlu
- **Hamburger Menü**: Mobil cihazlarda sidebar
- **Smooth Animasyonlar**: Hover efektleri, geçişler
- **Semantic Renk Paleti**: Tutarlı tasarım sistemi

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15**: React framework
- **React 19**: Modern UI kütüphanesi
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern ikonlar

### Backend

- **Flask**: Python web framework
- **Playwright**: Web scraper ve browser automation
- **Pydantic**: Veri validasyonu
- **Flask-CORS**: Cross-origin resource sharing

### Web Scraping

- **Sompo Sigorta**: Google Auth entegrasyonu
- **Quick Sigorta**: SMS Auth (mesai saatleri içinde)
- **Anadolu Sigorta**: Temel scraper desteği
- **Diğer Şirketler**: Mock veri sistemi

## 📁 Proje Yapısı

```
EESigorta/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── components/       # UI bileşenleri
│   │   ├── pages/           # Sayfa bileşenleri
│   │   ├── services/        # API servisleri
│   │   └── styles/          # CSS stilleri
│   └── public/              # Statik dosyalar
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── connectors/      # Web scraper'lar
│   │   ├── services/        # İş mantığı
│   │   └── models.py        # Veri modelleri
│   └── requirements.txt      # Python bağımlılıkları
└── README.md               # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd EESigorta
```

### 2. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
python3 run_backend.py
```

Backend `http://localhost:5001` adresinde çalışacak.

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

## 🔧 API Endpoints

### Dashboard

- `GET /api/dashboard` - İstatistikler ve özet bilgiler
- `GET /api/offers` - Son teklifler listesi

### Sigorta Teklifleri

- `POST /api/trafik` - Trafik sigortası teklifi
- `POST /api/kasko` - Kasko sigortası teklifi
- `POST /api/konut` - Konut sigortası teklifi
- `POST /api/saglik` - Sağlık sigortası teklifi

### Admin Panel

- `GET /api/admin/user-operations` - Kullanıcı işlemleri
- `GET /api/admin/users` - Kullanıcı listesi
- `GET /api/admin/companies` - Şirket bilgileri

## 🎯 Kullanım Kılavuzu

### 1. Dashboard'a Erişim

- Ana sayfada genel istatistikleri görün
- Mesai saati durumunu kontrol edin
- Acente ikonlarını inceleyin

### 2. Sigorta Teklifi Alma

- Sol menüden sigorta türünü seçin
- Form bilgilerini doldurun
- "Teklif Al" butonuna tıklayın
- Fiyatlar sayfasında sonuçları görün

### 3. Veri Kaynağı Seçimi

- Fiyatlar sayfasında "Veri Kaynağı" toggle'ını kullanın
- **Mock Veri**: Test amaçlı simülasyon
- **Gerçek API**: Web scraper ile canlı veri

### 4. Buton Durumları

- **Detaylar/Satın Al**: Sadece gerçek veriler geldiğinde aktif
- **Tekrar Dene**: Hata durumunda aktif
- **PDF İndir**: Başarılı teklifler varsa aktif

## 🌙 Dark Mode Özellikleri

- **Otomatik Tema**: Sistem tercihine göre
- **Manuel Toggle**: Navbar'da tema değiştirme butonu
- **Tutarlı Renkler**: Tüm bileşenlerde uyumlu palet
- **İkon Uyumu**: Dark mode'da görünür şirket logoları

## 📱 Responsive Tasarım

- **Mobil**: Hamburger menü, kompakt layout
- **Tablet**: Orta boyut optimizasyonu
- **Desktop**: Tam özellikli geniş ekran deneyimi

## 🔐 Güvenlik Özellikleri

- **CORS Koruması**: Cross-origin istekler için
- **Veri Validasyonu**: Pydantic ile tip kontrolü
- **Hata Yönetimi**: Graceful error handling
- **API Rate Limiting**: Aşırı kullanım koruması

## 🚧 Geliştirme Durumu

### ✅ Tamamlanan Özellikler

- Modern UI/UX tasarımı
- Dark/Light mode desteği
- Responsive hamburger menü
- Web scraper entegrasyonu
- Admin dashboard
- API endpoint'leri
- Mock veri sistemi

### 🔄 Devam Eden Geliştirmeler

- Sompo Google Auth entegrasyonu
- Quick SMS Auth optimizasyonu
- PDF indirme sistemi
- Satın alma süreci
- Detaylı raporlama

### 📋 Gelecek Özellikler

- Ödeme sistemi entegrasyonu
- Email bildirimleri
- SMS entegrasyonu
- Gelişmiş filtreleme
- Export/Import işlemleri

## 🐛 Bilinen Sorunlar

1. **Sompo Agent URL**: Doğru agent URL'i bulunması gerekiyor
2. **Quick SMS**: Mesai saatleri dışında çalışmıyor
3. **Port Çakışması**: Bazen port 5000/5001 çakışması olabilir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için:

- **Email**: [email@example.com]
- **GitHub**: [github-username]

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

## 🎉 Teşekkürler

Bu projeyi mümkün kılan tüm açık kaynak kütüphanelere ve topluluk katkılarına teşekkürler!

**Son Güncelleme**: Ekim 2025
**Versiyon**: 1.0.0

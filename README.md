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
- **Konut Sigortası**: Adres, değer bilgileri
- **Sağlık Sigortası**: Yaş, cinsiyet, sağlık durumu

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Otomatik tema geçişi
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Modern Animasyonlar**: Smooth geçişler ve hover efektleri
- **Temiz Arayüz**: Minimalist ve kullanıcı dostu tasarım

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 15**: React framework
- **React 19**: Modern React özellikleri
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern ikonlar

### Backend
- **Flask**: Python web framework
- **Playwright**: Web scraper ve browser automation
- **Pydantic**: Veri validasyonu
- **Asyncio**: Asenkron işlemler

## 📁 Proje Yapısı

```
EESigorta/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── components/      # React bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── services/       # API servisleri
│   │   └── styles/         # CSS stilleri
│   ├── public/             # Statik dosyalar
│   └── package.json        # Frontend bağımlılıkları
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── connectors/     # Web scraper'lar
│   │   ├── services/      # İş mantığı
│   │   └── main.py        # Ana uygulama
│   └── requirements.txt    # Backend bağımlılıkları
└── README.md               # Bu dosya
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- Python 3.8+
- Git

### Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

### Backend Kurulumu
```bash
cd backend
pip install -r requirements.txt
python run_backend.py
```

## 📖 Kullanım

### Dashboard
- Ana sayfa: `http://localhost:3000/dashboard`
- Gerçek zamanlı istatistikler görüntüleme
- Mesai saati ve SMS durumu kontrolü

### Sigorta Teklifleri
- **Trafik**: `http://localhost:3000/trafik`
- **Kasko**: `http://localhost:3000/kasko`
- **Konut**: `http://localhost:3000/konut`
- **Sağlık**: `http://localhost:3000/saglik`

### Fiyat Karşılaştırma
- **Fiyatlar**: `http://localhost:3000/fiyatlar`
- Gerçek API vs Mock veri karşılaştırması
- Akıllı buton sistemi

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard` - Dashboard istatistikleri
- `GET /api/offers` - Son teklifler

### Sigorta Teklifleri
- `POST /api/trafik` - Trafik sigortası teklifi
- `POST /api/kasko` - Kasko sigortası teklifi
- `POST /api/konut` - Konut sigortası teklifi
- `POST /api/saglik` - Sağlık sigortası teklifi

### Admin
- `GET /api/admin/user-operations` - Kullanıcı işlemleri
- `GET /api/admin/users` - Kullanıcı listesi
- `GET /api/admin/companies` - Şirket listesi

## 🌙 Dark Mode

Uygulama otomatik dark/light mode desteği sunar:
- **Tema Geçişi**: Navbar'daki toggle buton
- **Sistem Uyumu**: Sistem temasını takip eder
- **Kalıcı Seçim**: Kullanıcı tercihi kaydedilir

## 📱 Responsive Tasarım

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: sm, md, lg, xl ekran boyutları
- **Hamburger Menu**: Mobil navigasyon
- **Touch Friendly**: Dokunmatik ekran optimizasyonu

## 🔍 Web Scraper Özellikleri

### Desteklenen Şirketler
- **Sompo Sigorta**: Google Auth entegrasyonu
- **Quick Sigorta**: SMS Auth (mesai saatleri)
- **Anadolu Sigorta**: Temel scraper desteği

### Özellikler
- **Paralel İşlem**: Çoklu şirket sorgulama
- **Hata Yönetimi**: Robust error handling
- **Timeout Kontrolü**: Performans optimizasyonu
- **Mock Fallback**: API hatalarında yedek veri

## 📊 Veri Kaynağı Seçimi

### Mock Veri
- Test ve demo amaçlı
- Hızlı yanıt süresi
- Tutarlı sonuçlar

### Gerçek API
- Canlı web scraper verisi
- Gerçek zamanlı fiyatlar
- Dinamik sonuçlar

## 🎯 Gelecek Özellikler

- [ ] Daha fazla sigorta şirketi entegrasyonu
- [ ] PDF poliçe indirme
- [ ] Kullanıcı kayıt sistemi
- [ ] Ödeme entegrasyonu
- [ ] Mobil uygulama

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**Not**: Bu uygulama demo amaçlıdır. Gerçek sigorta işlemleri için lisanslı acentelerle çalışın.

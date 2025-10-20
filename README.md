# EESİGORTA - Sigorta Teklif Sistemi

Modern ve dinamik sigorta teklif sistemi. Gerçek zamanlı veri güncellemeleri, interaktif dashboard ve kapsamlı raporlama özellikleri.

## 📋 Gereksinimler

- Node.js 18+
- Python 3.8+
- Git

## 🛠️ Kurulum

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

### Backend (Python Flask)

```bash
cd backend
pip install -r requirements.txt
python3 -m flask --app app.main run --host=0.0.0.0 --port=8000
```

Backend `http://localhost:8000` adresinde çalışacak.

## 🚀 Kullanım

1. Frontend ve backend servislerini başlatın
2. `http://localhost:3000` adresine gidin
3. Admin paneli: `admin` / `admin123`
4. Şube kullanıcısı: `sube` / `sube123`

## 📊 Özellikler

- **Gerçek Zamanlı Dashboard**: Canlı veri güncellemeleri
- **Poliçe Kesme Sistemi**: Tam entegre poliçe yönetimi
- **Dinamik Grafikler**: Aylık trendler ve kategori dağılımları
- **Admin Paneli**: Kapsamlı yönetim araçları
- **Rapor Sistemi**: PDF/Excel export özellikleri
- **Web Scraper**: Gerçek sigorta şirketlerinden teklif çekme
- **Responsive Tasarım**: Mobil uyumlu arayüz

## 🔧 Geliştirme

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build
npm run build:prod
```

## 📝 Lisans

Bu proje özel kullanım için geliştirilmiştir.

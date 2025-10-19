# 🏢 EESigorta - Sigorta Acentesi Web Uygulaması

Modern ve kullanıcı dostu sigorta acentesi web uygulaması. Web scraper teknolojisi ile gerçek zamanlı sigorta teklifleri alın, müşteri işlemlerini takip edin ve admin paneli ile yönetim yapın.

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

---

**Not**: Bu uygulama demo amaçlıdır. Gerçek sigorta işlemleri için lisanslı acentelerle çalışın.
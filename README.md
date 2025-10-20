## Kurulum

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

## Kullanım

1. Frontend ve backend servislerini başlatın
2. `http://localhost:3000` adresine gidin
3. Admin paneli: `admin` / `admin123`
4. Şube kullanıcısı: `sube` / `sube123`

## Geliştirme

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build
npm run build:prod
```

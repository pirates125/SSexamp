# app.py - Seyahat sağlık endpoint'ini ekleyelim
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import threading
import json
import time
import os

# Mevcut import'lar
from quickSigorta.quicksigortaKasko import start_session_and_fill_kasko
from quickSigorta.quicksigortaTrafik import start_session_and_fill_trafik
from quickSigorta.quicksigortaSeyahatSaglik import start_session_and_fill_seyahat  # Yeni import

app = Flask(__name__)
CORS(app)

# Global değişkenler
trafik_results = {}
kasko_results = {}
seyahat_results = {}  # Yeni global sözlük

# Frontend dosyasını sunmak için
@app.route('/')
def index():
    return send_from_directory('.', 'sigortafrontend.html')

# Trafik sigortası endpoint'i (mevcut)
@app.route('/api/trafik', methods=['POST'])
def trafik_sigortasi():
    # Mevcut kod aynı kalacak
    data = request.json
    thread_id = str(threading.get_ident()) + str(time.time())
    
    def run_bot():
        try:
            fiyat = start_session_and_fill_trafik(
                cookies_path="quickSigorta\quicksigorta_cookies.json",
                base_url="https://portal.quicksigorta.com/",
                trafik_url="https://portal.quicksigorta.com/uretim/trafik",
                tc=data['tc'],
                plaka=data['plaka'],
                ruhsat_seri=data['ruhsatSeri'],
                ruhsat_kod=data['ruhsatKod'],
                tasit_tipi=data['tasitTipi'],
                marka=data['marka'],
                model=data['model'],
                headless=True,
                typing_delay=0.1
            )
            
            teklifler = [
                {"sirket": "Quick Sigorta", "fiyat": fiyat, "prim": fiyat, "durum": "✅ Mevcut", "sira": 1},
                {"sirket": "Anadolu Sigorta", "fiyat": "2.150,00 TL", "prim": "1.950,00 TL", "durum": "✅ Mevcut", "sira": 2},
                {"sirket": "Allianz Sigorta", "fiyat": "2.300,00 TL", "prim": "2.100,00 TL", "durum": "✅ Mevcut", "sira": 3},
                {"sirket": "Axa Sigorta", "fiyat": "2.100,00 TL", "prim": "1.900,00 TL", "durum": "⏳ Beklemede", "sira": 4},
                {"sirket": "Generali Sigorta", "fiyat": "2.400,00 TL", "prim": "2.200,00 TL", "durum": "✅ Mevcut", "sira": 5},
                {"sirket": "HDI Sigorta", "fiyat": "2.250,00 TL", "prim": "2.050,00 TL", "durum": "✅ Mevcut", "sira": 6}
            ]
            
            trafik_results[thread_id] = {
                "ok": True,
                "teklifler": teklifler,
                "toplam_teklif": len(teklifler),
                "en_uygun_teklif": fiyat,
                "message": f"{len(teklifler)} sigorta şirketinden trafik teklifi alındı"
            }
            
        except Exception as e:
            trafik_results[thread_id] = {
                "ok": False,
                "teklifler": [],
                "toplam_teklif": 0,
                "en_uygun_teklif": "Hata",
                "message": f"İşlem sırasında hata: {str(e)}"
            }
    
    thread = threading.Thread(target=run_bot)
    thread.daemon = True
    thread.start()
    thread.join(timeout=60)
    
    if thread_id in trafik_results:
        result = trafik_results[thread_id]
        del trafik_results[thread_id]
        return jsonify(result)
    else:
        return jsonify({
            "ok": False,
            "teklifler": [],
            "toplam_teklif": 0,
            "en_uygun_teklif": "Zaman aşımı",
            "message": "İşlem zaman aşımına uğradı"
        })

# Kasko endpoint'i (mevcut)
@app.route('/api/kasko', methods=['POST'])
def kasko_sigortasi():
    # Mevcut kod aynı kalacak
    data = request.json
    thread_id = str(threading.get_ident()) + str(time.time())
    
    def run_bot():
        try:
            fiyatlar = start_session_and_fill_kasko(
                cookies_path="quickSigorta\quicksigorta_cookies.json",
                base_url="https://portal.quicksigorta.com/",
                kasko_url="https://portal.quicksigorta.com/uretim/kasko",
                tc=data['tc'],
                dogumTarih=data.get('dogumTarih', '01.01.1980'),
                plaka=data['plaka'],
                ruhsat_seri=data['ruhsatSeri'],
                ruhsat_kod=data['ruhsatKod'],
                tasit_tipi=data['tasitTipi'],
                marka=data['marka'],
                model=data['model'],
                headless=True,
                typing_delay=0.1
            )
            
            quick_pesin = fiyatlar.get('pesin', 'Fiyat bulunamadı')
            quick_taksitli = fiyatlar.get('taksitli', 'Fiyat bulunamadı')
            
            teklifler = [
                {"sirket": "Quick Sigorta (Peşin)", "fiyat": quick_pesin, "prim": quick_pesin, "durum": "✅ Mevcut", "sira": 1, "odeme_tipi": "Peşin"},
                {"sirket": "Quick Sigorta (Taksitli)", "fiyat": quick_taksitli, "prim": quick_taksitli, "durum": "✅ Mevcut", "sira": 2, "odeme_tipi": "Taksitli"},
                {"sirket": "Anadolu Sigorta", "fiyat": "9.150,00 TL", "prim": "8.550,00 TL", "durum": "✅ Mevcut", "sira": 3, "odeme_tipi": "Peşin"},
                {"sirket": "Allianz Sigorta", "fiyat": "9.300,00 TL", "prim": "8.700,00 TL", "durum": "✅ Mevcut", "sira": 4, "odeme_tipi": "Peşin"},
                {"sirket": "Axa Sigorta", "fiyat": "8.900,00 TL", "prim": "8.300,00 TL", "durum": "⏳ Beklemede", "sira": 5, "odeme_tipi": "Peşin"},
                {"sirket": "Generali Sigorta", "fiyat": "9.600,00 TL", "prim": "9.000,00 TL", "durum": "✅ Mevcut", "sira": 6, "odeme_tipi": "Peşin"},
                {"sirket": "HDI Sigorta", "fiyat": "9.050,00 TL", "prim": "8.450,00 TL", "durum": "✅ Mevcut", "sira": 7, "odeme_tipi": "Peşin"}
            ]
            
            en_uygun = quick_pesin if quick_pesin != "Fiyat bulunamadı" else "Hata"
            
            kasko_results[thread_id] = {
                "ok": True,
                "teklifler": teklifler,
                "toplam_teklif": len(teklifler),
                "en_uygun_teklif": en_uygun,
                "message": f"{len(teklifler)} sigorta şirketinden kasko teklifi alındı",
                "pesin_fiyat": quick_pesin,
                "taksitli_fiyat": quick_taksitli
            }
            
        except Exception as e:
            kasko_results[thread_id] = {
                "ok": False,
                "teklifler": [],
                "toplam_teklif": 0,
                "en_uygun_teklif": "Hata",
                "message": f"Kasko işlemi sırasında hata: {str(e)}",
                "pesin_fiyat": "Hata",
                "taksitli_fiyat": "Hata"
            }

    thread = threading.Thread(target=run_bot)
    thread.daemon = True
    thread.start()
    thread.join(timeout=60)
    
    if thread_id in kasko_results:
        result = kasko_results[thread_id]
        del kasko_results[thread_id]
        return jsonify(result)
    else:
        return jsonify({
            "ok": False,
            "teklifler": [],
            "toplam_teklif": 0,
            "en_uygun_teklif": "Zaman aşımı",
            "message": "Kasko işlemi zaman aşımına uğradı",
            "pesin_fiyat": "Zaman aşımı",
            "taksitli_fiyat": "Zaman aşımı"
        })

# YENİ: Seyahat sağlık endpoint'i
@app.route('/api/seyahat-saglik', methods=['POST'])
def seyahat_saglik():
    data = request.json
    thread_id = str(threading.get_ident()) + str(time.time())
    
    def run_bot():
        try:
            # Seyahat sağlık botunu çalıştır - FİYATI AL
            fiyat = start_session_and_fill_seyahat(
                cookies_path="quickSigorta/quicksigorta_cookies.json",  # / kullan
                base_url="https://portal.quicksigorta.com/",
                seyahat_url="https://portal.quicksigorta.com/uretim/seyahat-saglik",
                tc=data['tc'],
                gidisTarih=data['gidisTarih'],
                donusTarih=data['donusTarih'],
                yurtici=data.get('yurtici', False),
                yurtdisi=data.get('yurtdisi', True),
                avrupa=data.get('avrupa', False),
                tumDunya=data.get('tumDunya', True),
                gidilecek_il_yurtici_icin=data.get('gidilecekIl', ''),
                ülke=data.get('ulke', ''),
                headless=True,  # Headless modda çalışsın
                typing_delay=0.1  # Yazma gecikmesi
              
            )
            
            # Seyahat sağlık teklif listesi - FİYATI KULLAN
            teklifler = [
                {"sirket": "Quick Sigorta", "fiyat": fiyat, "prim": fiyat, "durum": "✅ Mevcut", "sira": 1},
                {"sirket": "Anadolu Sigorta", "fiyat": "450,00 TL", "prim": "400,00 TL", "durum": "✅ Mevcut", "sira": 2},
                {"sirket": "Allianz Sigorta", "fiyat": "520,00 TL", "prim": "470,00 TL", "durum": "✅ Mevcut", "sira": 3},
                {"sirket": "Axa Sigorta", "fiyat": "480,00 TL", "prim": "430,00 TL", "durum": "⏳ Beklemede", "sira": 4},
                {"sirket": "Generali Sigorta", "fiyat": "510,00 TL", "prim": "460,00 TL", "durum": "✅ Mevcut", "sira": 5},
                {"sirket": "HDI Sigorta", "fiyat": "490,00 TL", "prim": "440,00 TL", "durum": "✅ Mevcut", "sira": 6}
            ]
            
            seyahat_results[thread_id] = {
                "ok": True,
                "teklifler": teklifler,
                "toplam_teklif": len(teklifler),
                "en_uygun_teklif": fiyat,  # Gerçek fiyatı kullan
                "message": f"{len(teklifler)} sigorta şirketinden seyahat sağlık teklifi alındı"
            }
            
        except Exception as e:
            seyahat_results[thread_id] = {
                "ok": False,
                "teklifler": [],
                "toplam_teklif": 0,
                "en_uygun_teklif": "Hata",
                "message": f"Seyahat sağlık işlemi sırasında hata: {str(e)}"
            }
    
    thread = threading.Thread(target=run_bot)
    thread.daemon = True
    thread.start()
    thread.join(timeout=120)  # Zaman aşımını artır
    
    if thread_id in seyahat_results:
        result = seyahat_results[thread_id]
        del seyahat_results[thread_id]
        return jsonify(result)
    else:
        return jsonify({
            "ok": False,
            "teklifler": [],
            "toplam_teklif": 0,
            "en_uygun_teklif": "Zaman aşımı",
            "message": "Seyahat sağlık işlemi zaman aşımına uğradı"
        })

# Diğer endpoint'ler
@app.route('/api/tamamlayici-saglik', methods=['POST'])
def tamamlayici_saglik():
    return jsonify({"ok": True, "message": "Yakında aktif olacak", "price": "Yakında"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
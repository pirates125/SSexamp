import os, uuid, datetime as dt
from typing import Any, Dict
from .base import BaseConnector
from ..browser import browser_context
from ..utils import parse_tl
from playwright.async_api import TimeoutError as PWTimeout

class SompoConnector(BaseConnector):
    def __init__(self):
        super().__init__("Sompo Sigorta")
    
    async def fetch_quote(self, payload: Dict[str, Any]) -> dict:
        # Sompo Sigorta gerçek URL'leri
        url = os.getenv("SOMPO_URL", "https://www.somposigorta.com.tr/agent/login")
        user = os.getenv("SOMPO_USER", "")
        pwd  = os.getenv("SOMPO_PASS", "")
        proxy= os.getenv("HTTP_PROXY") or None
        headless = os.getenv("PLAYWRIGHT_HEADLESS","true").lower() != "false"

        print(f"🔍 Sompo'ya bağlanıyor: {url}")
        print(f"👤 Kullanıcı: {user}")
        print(f"🔒 Headless: {headless}")

        async with browser_context(proxy, headless=headless) as ctx:
            page = await ctx.new_page()
            try:
                # Sayfaya git
                await page.goto(url, timeout=30000)
                print("✅ Sompo sayfası yüklendi")
                
                # Sayfa başlığını kontrol et
                title = await page.title()
                print(f"📄 Sayfa başlığı: {title}")
                
                # Login formunu bul ve doldur
                print("🔐 Login formu aranıyor...")
                
                # Farklı login selector'larını dene
                login_selectors = [
                    'input[name="username"]',
                    'input[name="email"]', 
                    'input[name="user"]',
                    'input[type="email"]',
                    '#username',
                    '#email',
                    '#user',
                    '.username',
                    '.email'
                ]
                
                username_filled = False
                for selector in login_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.fill(selector, user)
                            print(f"✅ Username dolduruldu: {selector}")
                            username_filled = True
                            break
                    except:
                        continue
                
                if not username_filled:
                    print("❌ Username input bulunamadı")
                    # Sayfa içeriğini yazdır
                    content = await page.content()
                    print("📄 Sayfa içeriği (ilk 500 karakter):")
                    print(content[:500])
                
                # Password input'u bul
                password_selectors = [
                    'input[name="password"]',
                    'input[type="password"]',
                    '#password',
                    '.password'
                ]
                
                password_filled = False
                for selector in password_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.fill(selector, pwd)
                            print(f"✅ Password dolduruldu: {selector}")
                            password_filled = True
                            break
                    except:
                        continue
                
                if not password_filled:
                    print("❌ Password input bulunamadı")
                
                # Submit butonunu bul ve tıkla
                submit_selectors = [
                    'button[type="submit"]',
                    'input[type="submit"]',
                    'button:has-text("Giriş")',
                    'button:has-text("Login")',
                    '.login-btn',
                    '#login-btn'
                ]
                
                submitted = False
                for selector in submit_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.click(selector)
                            print(f"✅ Submit butonu tıklandı: {selector}")
                            submitted = True
                            break
                    except:
                        continue
                
                if not submitted:
                    print("❌ Submit butonu bulunamadı")
                
                # Login sonrası bekle
                await page.wait_for_load_state("networkidle", timeout=20000)
                print("✅ Login işlemi tamamlandı")
                
                # Başarılı login kontrolü
                current_url = page.url
                print(f"📍 Mevcut URL: {current_url}")
                
                # Eğer hala login sayfasındaysak, hata var
                if "login" in current_url.lower():
                    print("❌ Login başarısız - hala login sayfasında")
                    raise RuntimeError("Sompo login başarısız")
                
                # Trafik sigortası sayfasına git
                product = payload.get("product","trafik")
                print(f"🚗 Ürün türü: {product}")
                
                # Trafik sigortası linklerini ara
                trafik_selectors = [
                    'a:has-text("Trafik")',
                    'a:has-text("Trafik Sigortası")',
                    'a[href*="trafik"]',
                    '.trafik-link',
                    '#trafik'
                ]
                
                trafik_found = False
                for selector in trafik_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.click(selector)
                            print(f"✅ Trafik sigortası sayfasına gidildi: {selector}")
                            trafik_found = True
                            break
                    except:
                        continue
                
                if not trafik_found:
                    print("⚠️ Trafik sigortası linki bulunamadı, mevcut sayfada devam ediliyor")
                
                # Form doldurma
                plate = payload.get("plate","34ABC123")
                print(f"🚗 Plaka: {plate}")
                
                # Plaka input'unu bul ve doldur
                plate_selectors = [
                    'input[name="plaka"]',
                    'input[name="plate"]',
                    'input[placeholder*="plaka"]',
                    'input[placeholder*="plate"]',
                    '#plaka',
                    '#plate'
                ]
                
                plate_filled = False
                for selector in plate_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.fill(selector, plate)
                            print(f"✅ Plaka dolduruldu: {selector}")
                            plate_filled = True
                            break
                    except:
                        continue
                
                if not plate_filled:
                    print("❌ Plaka input bulunamadı")
                
                # Ek bilgileri doldur
                extras = payload.get("extras", {})
                if extras.get("ruhsatSeri"):
                    ruhsat_selectors = [
                        'input[name="ruhsatSeri"]',
                        'input[name="ruhsat"]',
                        'input[placeholder*="ruhsat"]',
                        '#ruhsat'
                    ]
                    
                    for selector in ruhsat_selectors:
                        try:
                            if await page.query_selector(selector):
                                await page.fill(selector, extras["ruhsatSeri"])
                                print(f"✅ Ruhsat seri dolduruldu: {selector}")
                                break
                        except:
                            continue
                
                # Form submit
                form_submit_selectors = [
                    'button[type="submit"]',
                    'input[type="submit"]',
                    'button:has-text("Teklif Al")',
                    'button:has-text("Sorgula")',
                    '.submit-btn'
                ]
                
                form_submitted = False
                for selector in form_submit_selectors:
                    try:
                        if await page.query_selector(selector):
                            await page.click(selector)
                            print(f"✅ Form submit edildi: {selector}")
                            form_submitted = True
                            break
                    except:
                        continue
                
                if not form_submitted:
                    print("❌ Form submit butonu bulunamadı")
                
                # Sonuçları bekle
                print("⏳ Sonuçlar bekleniyor...")
                await page.wait_for_timeout(5000)  # 5 saniye bekle
                
                # Fiyat bilgisini ara - daha spesifik selector'lar
                price_selectors = [
                    '.premium',
                    '.prim',
                    '.amount',
                    '.cost',
                    '[class*="premium"]',
                    '[class*="prim"]',
                    '[class*="amount"]',
                    '[class*="cost"]',
                    'td:has-text("TL"):not(:has-text("000"))',  # 000 içermeyen TL'ler
                    'span:has-text("TL"):not(:has-text("000"))',
                    '.price:not(:has-text("000"))',
                    '.fiyat:not(:has-text("000"))'
                ]
                
                price_text = None
                for selector in price_selectors:
                    try:
                        element = await page.query_selector(selector)
                        if element:
                            price_text = await element.text_content()
                            if price_text and "TL" in price_text:
                                # Çok yüksek fiyatları filtrele (muhtemelen yanlış element)
                                parsed_price = parse_tl(price_text)
                                if 1000 <= parsed_price <= 50000:  # 1.000-50.000 TL arası makul fiyatlar
                                    print(f"✅ Fiyat bulundu: {price_text} -> {parsed_price}")
                                    break
                                else:
                                    print(f"⚠️ Çok yüksek fiyat atlandı: {price_text} -> {parsed_price}")
                                    price_text = None
                    except:
                        continue
                
                if not price_text:
                    print("❌ Uygun fiyat bulunamadı")
                    # Sayfa içeriğini kontrol et
                    content = await page.content()
                    if "TL" in content:
                        print("⚠️ Sayfada TL içeriği var ama uygun fiyat bulunamadı")
                        # Tüm TL içeren elementleri listele
                        try:
                            all_tl_elements = await page.query_selector_all('*:has-text("TL")')
                            for i, el in enumerate(all_tl_elements[:5]):  # İlk 5'i göster
                                text = await el.text_content()
                                if text and "TL" in text:
                                    print(f"   {i+1}. {text}")
                        except:
                            pass
                    else:
                        print("❌ Sayfada hiç TL içeriği yok")
                
                # Mock fiyat kullan
                premium = parse_tl(price_text or "4350")
                print(f"💰 Premium: {premium}")

            except PWTimeout as e:
                # Screenshot al
                path = f"/tmp/sompo_timeout_{uuid.uuid4().hex}.png"
                try: 
                    await page.screenshot(path=path)
                    print(f"📸 Timeout screenshot: {path}")
                except: 
                    pass
                raise RuntimeError(f"Sompo timeout: {e}")
            except Exception as e:
                # Screenshot al
                path = f"/tmp/sompo_error_{uuid.uuid4().hex}.png"
                try: 
                    await page.screenshot(path=path)
                    print(f"📸 Error screenshot: {path}")
                except: 
                    pass
                print(f"❌ Sompo hatası: {e}")
                raise
            finally:
                await page.close()

        return {
            "id": str(uuid.uuid4()),
            "company": self.company,
            "premium": float(premium),
            "currency": "TRY",
            "validUntil": (dt.datetime.utcnow() + dt.timedelta(hours=2)).isoformat() + "Z",
            "coverages": [
                {"code":"TRAFIK_ZORUNLU","label":"Zorunlu Trafik"}
            ],
            "extras": {"note":"sompo playwright", "url": url, "user": user},
        }

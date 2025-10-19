import json
import time
import re
import os
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# Cookie fonksiyonlarını quicksigortaTrafik'ten al
def ensure_cookies_exist(cookies_path: str) -> bool:
    """
    Cookie dosyası yoksa veya geçersizse get_cookie.py'yi çalıştırır
    """
    if not os.path.exists(cookies_path):
        print("Cookie dosyası bulunamadı. get_cookie.py çalıştırılıyor...")
        return run_get_cookie_script()
    
    try:
        with open(cookies_path, "r", encoding="utf-8") as f:
            cookies = json.load(f)
        
        # Cookie dosyası boş mu kontrol et
        if not cookies or len(cookies) == 0:
            print("Cookie dosyası boş. get_cookie.py çalıştırılıyor...")
            return run_get_cookie_script()
        
        # Cookie'lerin geçerliliğini kontrol et (expiry date)
        current_time = time.time()
        valid_cookies = []
        
        for cookie in cookies:
            expiry = cookie.get('expiry', 0)
            if expiry > current_time or expiry == 0:  # 0 = session cookie
                valid_cookies.append(cookie)
        
        if len(valid_cookies) == 0:
            print("Tüm cookie'lerin süresi dolmuş. get_cookie.py çalıştırılıyor...")
            return run_get_cookie_script()
        
        # Geçerli cookie'leri kaydet
        if len(valid_cookies) < len(cookies):
            with open(cookies_path, "w", encoding="utf-8") as f:
                json.dump(valid_cookies, f, ensure_ascii=False, indent=4)
            print(f"{len(cookies) - len(valid_cookies)} adet süresi dolmuş cookie temizlendi.")
        
        return True
        
    except (json.JSONDecodeError, Exception) as e:
        print(f"Cookie dosyası okunamadı: {e}. get_cookie.py çalıştırılıyor...")
        return run_get_cookie_script()

def run_get_cookie_script() -> bool:
    """
    get_cookie.py script'ini çalıştırır - HEADLESS MODDA
    """
    try:
        # get_cookie.py dosyasının yolunu belirle
        script_path = "get_cookie.py"
        
        if not os.path.exists(script_path):
            print("Hata: get_cookie.py dosyası bulunamadı!")
            return False
        
        print("get_cookie.py HEADLESS modda çalıştırılıyor...")
        
        # Headless mod için geçici bir script oluştur
        headless_script = """
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# HEADLESS AYARLARI
opts = Options()
opts.add_argument("--headless=new")
opts.add_argument("--no-sandbox")
opts.add_argument("--disable-dev-shm-usage")
opts.add_argument("--disable-gpu")
opts.add_argument("--window-size=1920,1080")
opts.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

USERNAME = "A600110001"
PASSWORD = "Eesigorta28."
LOGIN_URL = "https://portal.quicksigorta.com/login"
COOKIE_FILE = "quicksigorta_cookies.json"

driver = webdriver.Chrome(options=opts)

try:
    # 1️⃣ Login sayfasını aç
    driver.get(LOGIN_URL)
    time.sleep(5)  # Sayfanın yüklenmesi için bekle

    # 2️⃣ Kullanıcı adı ve şifre alanlarını bul ve doldur
    username_field = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id=":r0:"]'))
    )
    username_field.send_keys(USERNAME)

    password_field = driver.find_element(By.XPATH, '//*[@id=":r1:"]')
    password_field.send_keys(PASSWORD)

    # 3️⃣ Login butonuna tıkla
    login_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div[1]/div/div/form/div[2]/button')
    login_btn.click()

    # 4️⃣ Girişin başarılı olduğunu bekle
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, '//*[contains(text(), "EMRAH") or contains(text(), "A600110001")]'))
    )
    print("Headless giriş başarılı!")

    # 5️⃣ Cookie'leri al
    cookies = driver.get_cookies()

    # 6️⃣ JSON dosyasına kaydet
    with open(COOKIE_FILE, "w", encoding="utf-8") as f:
        json.dump(cookies, f, ensure_ascii=False, indent=4)

    print(f"Headless cookie dosyası oluşturuldu. Toplam {len(cookies)} cookie kaydedildi.")

except Exception as e:
    print(f"Headless login hatası: {e}")
    
finally:
    driver.quit()
"""
        
        # Geçici headless script dosyası oluştur
        with open("get_cookie_headless.py", "w", encoding="utf-8") as f:
            f.write(headless_script)
        
        # Headless script'i çalıştır
        result = subprocess.run(["python", "get_cookie_headless.py"], 
                              capture_output=True, 
                              text=True, 
                              timeout=120)
        
        # Geçici dosyayı temizle
        try:
            os.remove("get_cookie_headless.py")
        except:
            pass
        
        if result.returncode == 0:
            print("Headless get_cookie.py başarıyla çalıştı!")
            
            # Cookie dosyasının oluştuğunu kontrol et
            if os.path.exists("quicksigorta_cookies.json"):
                print("Cookie dosyası başarıyla oluşturuldu.")
                return True
            else:
                print("Hata: Cookie dosyası oluşturulamadı!")
                return False
        else:
            print(f"Headless get_cookie.py hata kodu: {result.returncode}")
            print(f"Stdout: {result.stdout}")
            print(f"Stderr: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("Hata: Headless get_cookie.py zaman aşımına uğradı!")
        return False
    except Exception as e:
        print(f"Headless get_cookie.py çalıştırılırken hata: {e}")
        return False

def load_cookies_to_driver(driver, cookies_path: str) -> bool:
    """
    Cookie'leri driver'a yükler, gerekirse yenilerini alır
    """
    # Önce cookie dosyasının varlığını ve geçerliliğini kontrol et
    if not ensure_cookies_exist(cookies_path):
        print("Hata: Cookie'ler yüklenemedi!")
        return False
    
    try:
        with open(cookies_path, "r", encoding="utf-8") as f:
            cookies = json.load(f)
        
        success_count = 0
        for c in cookies:
            cookie = c.copy()
            cookie.pop("sameSite", None)
            
            if "expiry" in cookie:
                try:
                    cookie["expiry"] = int(cookie["expiry"])
                except Exception:
                    cookie.pop("expiry", None)
            
            try:
                driver.add_cookie(cookie)
                success_count += 1
            except Exception as e:
                print(f"Cookie eklenemedi ({cookie.get('name', 'unknown')}): {e}")
        
        print(f"{success_count}/{len(cookies)} adet cookie başarıyla yüklendi.")
        return success_count > 0  # En az bir cookie yüklenmişse başarılı
        
    except Exception as e:
        print(f"Cookie yükleme hatası: {e}")
        return False


def start_session_and_fill_kasko(
    cookies_path: str,
    base_url: str,
    kasko_url: str,
    tc: str,
    dogumTarih: str,
    plaka: str,
    ruhsat_seri: str,
    ruhsat_kod: str,
    tasit_tipi: str,
    marka: str,
    model: str,
    headless: bool = True,
    typing_delay: float = 0.1
) -> dict:
    """
    Kasko sigortası için form doldurur ve hem peşin hem de taksitli fiyat bilgisini döndürür.
    Dönüş değeri: {"pesin": "Fiyat", "taksitli": "Fiyat"} şeklinde bir sözlüktür.
    """
    opts = Options()
    
    # HEADLESS AYARLARI
    if headless:
        opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--disable-gpu")
        opts.add_argument("--window-size=1920,1080")
        opts.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(options=opts)
    
    if not headless:
        driver.maximize_window()

    try:
        # Base sayfayı aç
        print("Web sitesine bağlanılıyor...")
        driver.get(base_url)
        time.sleep(3)
        
        # Cookie'leri yükle (gerekirse yeniden al)
        print("Cookie'ler yükleniyor...")
        if not load_cookies_to_driver(driver, cookies_path):
            return {"pesin": "Hata", "taksitli": "Hata"}
        
        # Cookie'ler yüklendikten sonra sayfayı yenile
        driver.refresh()
        time.sleep(4)

        # Giriş yapıldığını kontrol et
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'EMRAH') or contains(text(), 'A600110001')]"))
            )
            print("Giriş başarılı! Kullanıcı bilgileri görüntülendi.")
        except:
            print("Uyarı: Giriş kontrolü yapılamadı, devam ediliyor...")

        # Kasko sayfasına geç
        print("Kasko Sigortası sayfasına yönlendiriliyor...")
        driver.get(kasko_url)
        time.sleep(6)

        # 1. Aşama: Temel bilgileri doldur
        fields = {
            'tc': (tc, '//*[@id="idNumber"]'),
            'plaka': (plaka, '//*[@id="plateNumber"]'),
            'ruhsat_kod': (ruhsat_kod, '//*[@id="serialCode"]'),
            'ruhsat_seri': (ruhsat_seri, '//*[@id="serialNo"]')
        }

        for key, (value, xpath) in fields.items():
            try:
                field = WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.XPATH, xpath))
                )
                field.clear()
                for char in value:
                    field.send_keys(char)
                    time.sleep(typing_delay)
                print(f"{key} alanı dolduruldu: {value}")
                time.sleep(0.5)
            except Exception as e:
                print(f"{key} alanı doldurulamadı:", e)
                return {"pesin": "Hata", "taksitli": "Hata"}

        # Doğum tarihi alanı
        newDogumTarih = dogumTarih.replace(".", "")
        dogum_xpath = '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/form/div[1]/div/div[2]/div/div/input'
        try:
            DogumT = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, dogum_xpath))
            )
            if not DogumT.get_attribute("disabled"):
                DogumT.clear()
                DogumT.click()
                for char in newDogumTarih:
                    DogumT.send_keys(char)
                    time.sleep(typing_delay)
                print(f"Doğum tarihi alanı dolduruldu: {newDogumTarih}")
            else:
                print("Doğum tarihi alanı disabled, değer girilmedi.")
            time.sleep(0.5)
        except Exception as e:
            print("Doğum tarihi alanı doldurulamadı:", e)


        # 2. Aşama: Kullanım tarzı, marka, model
        try:
            # Kullanım tarzı
            usage_input = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="usageStyle"]'))
            )
            usage_input.clear()
            usage_input.send_keys(tasit_tipi)
            time.sleep(1.5)
            usage_input.send_keys(Keys.ENTER)
            print("Kullanım tarzı girildi:", tasit_tipi)

            # Marka
            brand_field = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="brand"]'))
            )
            brand_field.clear()
            brand_field.send_keys(marka)
            time.sleep(1.5)
            brand_field.send_keys(Keys.ENTER)
            print("Marka girildi:", marka)

            # Model
            model_field = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="model"]'))
            )
            model_field.clear()
            model_field.send_keys(model)
            time.sleep(1.5)
            model_field.send_keys(Keys.ENTER)
            print("Model girildi:", model)
            time.sleep(1.5)
            # Son Devam Et
            submit_btn2 = WebDriverWait(driver, 15).until(
                EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/form/div[2]/button'))
            )
            submit_btn2.click()
            print("2. Devam Et tıklandı.")
            time.sleep(10)
        except Exception as e:
            print("2. Aşama hatası:", e)
            return {"pesin": "Hata", "taksitli": "Hata"}

        # 3. Fiyatı çek
        try:
            print("Kasko fiyatları aranıyor...")
            time.sleep(8)

            pesin_fiyat = "Fiyat bulunamadı"
            taksitli_fiyat = "Fiyat bulunamadı"

            # Peşin fiyat
            try:
                price_element = WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.ID, "kaskoSigortasiBundlePrice"))
                )
                pesin_fiyat = price_element.text.strip()
                print(f"Peşin fiyat bulundu: {pesin_fiyat}")
            except:
                print("Peşin fiyat bulunamadı")

            # Taksitli fiyat
            try:
                taksit_element = WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.ID, "taksitliKaskoSigortasiBundlePrice"))
                )
                taksitli_fiyat = taksit_element.text.strip()  # Burada taksit_fiyat yerine taksitli_fiyat olmalı
                print(f"Taksitli fiyat bulundu: {taksitli_fiyat}")
            except:
                print("Taksitli fiyat bulunamadı")

            return {"pesin": pesin_fiyat, "taksitli": taksitli_fiyat}
    
        except Exception as e:
            print("Fiyat çekme hatası:", e)
            return {"pesin": "Hata", "taksitli": "Hata"}
    except Exception as e:
        print("Genel hata:", e)
        return {"pesin": "Hata", "taksitli": "Hata"}
    finally:
        try:
            driver.quit()
        except:
            pass

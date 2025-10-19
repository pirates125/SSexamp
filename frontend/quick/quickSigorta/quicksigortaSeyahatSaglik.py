import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import threading
import os
import subprocess
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

def start_session_and_fill_seyahat(
    cookies_path: str,
    base_url: str,
    seyahat_url: str,
    tc: str,
    gidisTarih: str,
    donusTarih: str,
    avrupa: bool,
    tumDunya: bool,
    yurtici: bool = False,
    yurtdisi: bool = False,
    gidilecek_il_yurtici_icin: str = "",
    ülke: str = "",
    keep_alive_interval: int = 60 * 4,
    headless: bool = True,
    typing_delay: float = 0.1
   
) -> str:  # Artık string (fiyat) döndürüyor
    opts = Options()
    if headless:
        opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--disable-gpu")
        opts.add_argument("--window-size=1920,1080")
        opts.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        opts.add_argument("--disable-blink-features=AutomationControlled")
        opts.add_experimental_option("excludeSwitches", ["enable-automation"])
        opts.add_experimental_option('useAutomationExtension', False)
    else:
        opts.headless = False
    
    driver = webdriver.Chrome(options=opts)
    
    if not headless:
        driver.maximize_window()
    
    fiyat = "Fiyat bulunamadı"  # Varsayılan değer

    try:
        # Base sayfa ve çerezler
        driver.get(base_url)
        with open(cookies_path, "r", encoding="utf-8") as f:
            cookies = json.load(f)
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
            except Exception as e:
                print("Cookie eklenemedi:", cookie.get("name"), e)
        driver.get(base_url)
        
        if yurtici == True:
            yurtdisi = False
        elif yurtdisi == True:
            yurtici = False
            
        # Seyahat sigortası sayfasına geç
        driver.get(seyahat_url)
        print("Seyahat Sigortası sayfasına geçildi.")
        time.sleep(2)

        if yurtdisi and not yurtici:
            try:
                if avrupa:
                    avrupa_rb = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//*[@id="geographicalArea"]/label[1]/p'))
                    )
                    avrupa_rb.click()
                    print("Avrupa radio butonu seçildi.")
                if tumDunya:
                    tumDunya_rb = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//*[@id="geographicalArea"]/label[2]/p'))
                    )
                    tumDunya_rb.click()
                    print("Tüm Dünya radio butonu seçildi.")
                time.sleep(0.5)
            except Exception as e:
                print("Radio buton seçme hatası:", e)

            # 'Devam Et' butonuna tıkla
            try:
                submit_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="trafficFormSubmitBtn"]'))
                )
                time.sleep(0.5)
                submit_btn.click()
                print("'Devam Et' butonuna tıklandı.")
                time.sleep(2)
            except Exception as e:
                print("'Devam Et' butonuna tıklanamadı:", e)

            # Tarihleri noktasız hâle getir
            newGidisTarih = gidisTarih.replace(".", "")
            newDonusTarih = donusTarih.replace(".", "")

            # Form alanlarını doldur (TC, ülke, tarih)
            fields = {
                'tc': (tc, '//*[@id="idNumber"]'),
                'ülke': (ülke, '//*[@id="countryOfTravel"]'),
                'gidisTarih': (newGidisTarih, '//*[@id=":rc:"]'),
                'donusTarih': (newDonusTarih, '//*[@id=":re:"]')
            }

            for key, (value, xpath) in fields.items():
                try:
                    field = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, xpath))
                    )
                    field.clear()
                    field.click()
                    for char in value:
                        field.send_keys(char)
                        time.sleep(0.1)
                    print(f"{key} alanı dolduruldu: {value}")
                    time.sleep(0.5)
                except Exception as e:
                    print(f"{key} alanı doldurulamadı:", e)

            # Yurt içi/yurt dışı checkbox'ları
            try:
                if yurtdisi:
                    yurtdisi_cb = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//*[@id="type"]/label[1]/p'))
                    )
                    if not yurtdisi_cb.is_selected():
                        yurtdisi_cb.click()
                        print("Yurt dışı checkbox işaretlendi.")
                time.sleep(0.5)
            except Exception as e:
                print("Checkbox işaretleme hatası:", e)

            submit_btn = driver.find_element(By.XPATH, '//*[@id="travelHealthFormSubmitBtn"]') 
            submit_btn.click()
            print("Form gönderildi.")
            time.sleep(2)
            submit_btn2 = driver.find_element(By.XPATH, '//*[@id="travelHealthFormSubmitBtn"]')
            submit_btn2.click() 
            print("Sonraki sayfaya geçildi.")
            time.sleep(2)
            
            # Fiyatı al
            try:
                fiyat_element = driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/div/div/div[1]/div/div[1]/p')
                fiyat = fiyat_element.text
                print("Fiyat bilgisi:", fiyat)
            except Exception as e:
                print("Fiyat alınamadı:", e)
                fiyat = "Fiyat bulunamadı"

        elif yurtici and not yurtdisi:
            # Yurt içi checkbox işaretle
            yurtici_cb = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="type"]/label[2]/p'))
            )
            if not yurtici_cb.is_selected():
                yurtici_cb.click()
                print("Yurt içi checkbox işaretlendi.")
            time.sleep(2.5)
            
            # Tarihleri noktasız hâle getir
            newGidisTarih = gidisTarih.replace(".", "")
            newDonusTarih = donusTarih.replace(".", "")
            
            fields = {
                'tc': (tc, '//*[@id="idNumber"]'),
                'gidisTarih': (newGidisTarih, '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/form/div[1]/div/div/div/div[4]/div[1]/div/div/input'),
                'donusTarih': (newDonusTarih, '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/form/div[1]/div/div/div/div[4]/div[2]/div/div/input')
            }
            
            for key, (value, xpath) in fields.items():
                try:
                    field = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, xpath))
                    )
                    field.clear()
                    field.click()
                    for char in value:
                        field.send_keys(char)
                        time.sleep(0.1)
                    print(f"{key} alanı dolduruldu: {value}")
                    time.sleep(0.5)
                except Exception as e:
                    print(f"{key} alanı doldurulamadı:", e)
            
            # Gidilecek il
            try:
                il_field = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//*[@id="cityOfTravel"]'))
                )
                il_field.clear()
                il_field.click()
                for char in gidilecek_il_yurtici_icin:
                    il_field.send_keys(char)
                    time.sleep(0.1)
                time.sleep(1)
                il_field.send_keys(Keys.ARROW_DOWN)
                time.sleep(0.5)
                il_field.send_keys(Keys.ENTER)
                print("Gidilecek il seçildi:", gidilecek_il_yurtici_icin)
                time.sleep(0.5)
            except Exception as e:
                print("Gidilecek il seçilemedi:", e)
            
            submit_btn = driver.find_element(By.XPATH, '//*[@id="travelHealthFormSubmitBtn"]') 
            submit_btn.click()
            print("Form gönderildi.")
            time.sleep(2)
            submit_btn2 = driver.find_element(By.XPATH, '//*[@id="travelHealthFormSubmitBtn"]')
            submit_btn2.click() 
            print("Sonraki sayfaya geçildi.")
            time.sleep(5)
            
            # Fiyatı al
            try:
                fiyat_element = driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/div/div/div[1]/div/div[1]/p')
                fiyat = fiyat_element.text
                print("Fiyat bilgisi:", fiyat)
            except Exception as e:
                print("Fiyat alınamadı:", e)
                fiyat = "Fiyat bulunamadı"

    except Exception as e:
        print(f"Seyahat sigortası işleminde hata: {e}")
        fiyat = f"Hata: {str(e)}"
    
    finally:
        # Driver'ı kapat
        try:
            driver.quit()
        except:
            pass
    
    return fiyat  # Fiyatı döndür


# -*- coding: utf-8 -*-
import undetected_chromedriver as uc
from selenium.webdriver.chrome.options import Options as ChromeOptions
import json
import time
import sys

# Dosya yollarını, kaydettiğiniz dosyalara göre ayarlayın
COOKIE_FILE_PATH = "sompo\sompo_cookies.json" 
LOCAL_STORAGE_FILE_PATH = "sompo\sompo_local_storage.json" 

# Giriş başarılı olduktan sonraki Dashboard URL'si
DASHBOARD_URL = "https://ejento.somposigorta.com.tr/dashboard" 

def load_cookies_and_storage(driver):
    """Kaydedilmiş çerez ve Local Storage verilerini yükler."""
    try:
        # 1. Dashboard URL'sine git (Çerezlerin doğru domain'e yerleştirilmesi için)
        driver.get(DASHBOARD_URL) 

        # 2. Local Storage verilerini yükle
        try:
            with open(LOCAL_STORAGE_FILE_PATH, 'r', encoding='utf-8') as file:
                storage_data = json.load(file)
            for key, value in storage_data.items():
                driver.execute_script(f"localStorage.setItem('{key}', arguments[0]);", value)
            print(f"[BİLGİ] {len(storage_data)} adet Local Storage anahtarı yüklendi.")
        except FileNotFoundError:
            print("[UYARI] Local Storage dosyası bulunamadı, çerezlerle devam ediliyor.")

        # 3. Çerezleri yükle
        with open(COOKIE_FILE_PATH, 'r', encoding='utf-8') as file:
            cookies = json.load(file)
            
        for cookie in cookies:
            # 'expiry' alanı string veya float ise hata vermemesi için siliyoruz
            if 'expiry' in cookie:
                if isinstance(cookie['expiry'], (str, float, int)):
                    del cookie['expiry'] 
            driver.add_cookie(cookie)
        
        print(f"[BİLGİ] {len(cookies)} adet çerez başarıyla yüklendi.")
        
        # 4. Sayfayı yenileyerek oturumu aktif et
        driver.refresh()
        
        return True
        
    except Exception as e:
        print(f"[HATA] Oturum yüklenirken hata oluştu: {e}", file=sys.stderr)
        return False


def main():
    options = ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1200,800")
    
    driver = uc.Chrome(options=options)

    # Oturum verilerini yüklemeyi dene
    load_successful = load_cookies_and_storage(driver)

    if load_successful:
        # Oturum açıp açmadığını kontrol etmek için bekle
        time.sleep(3) 
        print(f"\n[SONUÇ] Dashboard Sayfası Başlığı: {driver.title}")

    # Manuel kapatma bekleme kısmı
    input("\nKapatmak için ENTER tuşuna basın.")
    
    driver.quit()

if __name__ == "__main__":
    main()
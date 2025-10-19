# -*- coding: utf-8 -*-
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys
import json 

# GİRİŞ BİLGİLERİ
YOUR_USERNAME = "BULUT1"
YOUR_PASSWORD = "EEsigorta.2828"

LOGIN_URL = "https://ejento.somposigorta.com.tr/dashboard/login"
# Kayıt Dosyaları
COOKIE_FILE_PATH = "sompo_cookies.json" 
LOCAL_STORAGE_FILE_PATH = "sompo_local_storage.json" 

def save_cookies(driver):
    """Tarayıcıdaki aktif çerezleri JSON dosyasına kaydeder."""
    try:
        cookies = driver.get_cookies()
        with open(COOKIE_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(cookies, file, ensure_ascii=False, indent=4) 
        
        print(f"\n[BİLGİ] {len(cookies)} adet çerez başarıyla '{COOKIE_FILE_PATH}' dosyasına kaydedildi.")
    except Exception as e:
        print(f"\n[HATA] Çerez kaydı başarısız oldu: {e}", file=sys.stderr)

def save_storage(driver):
    """Tarayıcıdaki Local Storage verilerini kaydeder."""
    try:
        local_storage_data = driver.execute_script(
            "var items = {}; "
            "for (var i = 0; i < localStorage.length; i++) {"
            "    items[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));"
            "} "
            "return items;"
        )
        
        with open(LOCAL_STORAGE_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(local_storage_data, file, ensure_ascii=False, indent=4) 
        
        print(f"[BİLGİ] Local Storage verileri '{LOCAL_STORAGE_FILE_PATH}' dosyasına kaydedildi.")
    except Exception as e:
        print(f"\n[HATA] Local Storage kaydı başarısız oldu: {e}", file=sys.stderr)


def main():
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1200,800") 
    
    driver = uc.Chrome(options=options)

    try:
        driver.get(LOGIN_URL)
        
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        print("Sayfa açıldı:", driver.title)
        
        # ----------------------------------------------------
        # GİRİŞ İŞLEMİ (Kullanıcı Adı ve Şifre)
        # ----------------------------------------------------
        
        USERNAME_XPATH = '/html/body/div[1]/div/div[1]/div[2]/form/div[1]/div/input'
        username_field = driver.find_element(By.XPATH, USERNAME_XPATH)
        username_field.send_keys(YOUR_USERNAME)
        
        PASSWORD_XPATH = '/html/body/div[1]/div/div[1]/div[2]/form/div[2]/div/div/input'
        password_field = driver.find_element(By.XPATH, PASSWORD_XPATH)
        password_field.send_keys(YOUR_PASSWORD)
        print("Kullanıcı adı ve şifre girildi.")

        # ----------------------------------------------------
        # MANUEL GİRİŞ KONTROL NOKTASI
        # ----------------------------------------------------
        
        print("\n==================================================")
        print("LÜTFEN ŞİMDİ TARAYICIYA MANUEL KODU/BİLGİYİ GİRİNİZ.")
        print("==================================================")
        
        # Kullanıcı manuel kodu girdikten ve butona tıkladıktan sonra terminalde onay bekliyoruz.
        input("Manuel girişi tamamladıktan sonra DEVAM etmek için ENTER tuşuna basın: ")
        
        print("Manuel giriş tamamlandı, oturum kontrol ediliyor...")

        # ----------------------------------------------------
        # GİRİŞ SONUCUNU KONTROL ET VE KAYDET
        # ----------------------------------------------------
        
        # Dashboard URL'sinin yüklenmesini bekle (Girişin başarılı olduğunu doğrular)
        WebDriverWait(driver, 15).until(
            EC.url_changes(LOGIN_URL) 
        )
        print("Giriş başarılı! Dashboard sayfasına geçildi.")
        print(f"Güncel Sayfa Başlığı: {driver.title}")
        
        # Oturum verilerini kaydetme
        save_cookies(driver)
        save_storage(driver)
        
        print("\n[BİLGİ] Oturum verileri kaydedildi.")
        
    except Exception as e:
        print(f"Bir hata oluştu: {e}", file=sys.stderr)
        
    finally:
        driver.quit()
        print("Tarayıcı kapatıldı.")

if __name__ == "__main__":
    main()
import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ===== Ayarlar =====
USERNAME = "A600110001"
PASSWORD = "Eesigorta28."
LOGIN_URL = "https://portal.quicksigorta.com/login"
COOKIE_FILE = "quickSigorta\quicksigorta_cookies.json"

driver = webdriver.Chrome()
driver.maximize_window()

# 1️⃣ Login sayfasını aç
driver.get(LOGIN_URL)

time.sleep(3)  # Sayfanın yüklenmesi için bekle

# 2️⃣ Kullanıcı adı ve şifre alanlarını bul ve doldur
username_field = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//*[@id=":r0:"]'))  # Örnek XPath
)
username_field.send_keys(USERNAME)

password_field = driver.find_element(By.XPATH, '//*[@id=":r1:"]')  # Şifre alanının XPath
password_field.send_keys(PASSWORD)

# 3️⃣ Login butonuna tıkla
login_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div[1]/div/div/form/div[2]/button')  # Butonun XPath
login_btn.click()

# 4️⃣ Girişin başarılı olduğunu bekle
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/header/div[2]/button/div'))  # Profil menüsü vs.
)
print("Giriş başarılı!")

# 5️⃣ Cookie’leri al
cookies = driver.get_cookies()

# 6️⃣ JSON dosyasına kaydet
with open(COOKIE_FILE, "w", encoding="utf-8") as f:
    json.dump(cookies, f, ensure_ascii=False, indent=4)

print(f"Cookie dosyası oluşturuldu. Toplam {len(cookies)} cookie kaydedildi.")

# 7️⃣ Tarayıcı açık kalsın
print("Tarayıcı açık kalacak. 15 saniye bekleyecek...")
time.sleep(15)
driver.quit()

import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import threading

def start_session_and_fill_seyahat(
    saglik_url: str,
    tc: str,
    dogumTarih: str,
    tel: str,
    email: str="ssss@gmail.com",
    

    keep_alive_interval: int = 60*4,
    headless: bool = False,
    typing_delay: float = 0.1
) -> webdriver.Chrome:
    opts = Options()
    opts.headless = headless
    driver = webdriver.Chrome(options=opts)
    driver.maximize_window()
   

    # Sağlık sigortası sayfasına geç
    driver.get(saglik_url)
    print("Sağlık Sigortası sayfasına geçildi.")
    time.sleep(5)
   
    # dropdown = driver.find_element(By.XPATH, '/html/body/span/span/span[1]/input')
    # dropdown.click()
    # dropdown.send_keys("Quick Süper Yatarak Tedavi")
    # time.sleep(1)
    fields = {
        'tc': (tc, '//*[@id="tss-form-application"]/div[1]/div[1]/div[1]/div/input'),
        'dogum_tarih': (dogumTarih, '/html/body/div[1]/div[2]/div[1]/section/div/div/div/div[1]/div[3]/section[1]/div/form/div[1]/div[1]/div[2]/div/div/input'),        
        'email': (email, '/html/body/div[1]/div[2]/div[1]/section/div/div/div/div[1]/div[3]/section[1]/div/form/div[2]/div[1]/div/input')
    
    }
    for key, (value, xpath) in fields.items():
        try:
            field = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
            field.clear()
            for char in value:
                field.send_keys(char)
                time.sleep(typing_delay)  # Karakterler arasında bekle
            print(f"{key} alanı dolduruldu: {value}")
            time.sleep(0.5)  # Alan doldurulduktan sonra kısa bekleme
        except Exception as e:
            print(f"{key} alanı doldurulamadı:", e)
    tel_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div[2]/div[1]/section/div/div/div/div[1]/div[3]/section[1]/div/form/div[2]/div[2]/div/input'))
    )
    tel_field.clear()
    for char in tel:
        tel_field.send_keys(char)
        time.sleep(typing_delay)
    print(f"tel alanı dolduruldu: {tel}")
    try:
        # Poliçe, Gizlilik ve Kullanıcı Sözleşmesi checkbox
        legal_contract = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "legal-contract"))
        )
        driver.execute_script("arguments[0].click();", legal_contract)

        # KVKK Aydınlatma Metni checkbox
        legal_kvkk = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "legal-kvkk"))
        )
        driver.execute_script("arguments[0].click();", legal_kvkk)

        # Açık Rıza Metni checkbox
        legal_consent = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "legal-consent"))
        )
        driver.execute_script("arguments[0].click();", legal_consent)

        print("Tüm onay kutuları JS ile işaretlendi.")
    except Exception as e:
        print("Checkbox JS ile de işaretlenemedi:", e)
    time.sleep(30)
    def keep_alive():
        while True:
            try:
                driver.execute_script(
                    "window.scrollTo(0, document.body.scrollHeight); "
                    "setTimeout(()=>window.scrollTo(0,0),800);"
                )
                print("Keep-alive gönderildi:", time.strftime("%Y-%m-%d %H:%M:%S"))
                time.sleep(keep_alive_interval)
            except Exception as e:
                print("Keep-alive hatası:", e)
                break

    threading.Thread(target=keep_alive, daemon=True).start()

    return driver


# ===== Örnek Kullanım =====
if __name__ == "__main__":
    driver = start_session_and_fill_seyahat(   
        saglik_url="https://acente.quicksigorta.com/tamamlayici-saglik-sigortasi",
        tc="48274206902",
        dogumTarih="01.01.2002",
        tel="5355978452",
        keep_alive_interval=60*4,
        headless=False,
        typing_delay=0.2
    )

    
    time.sleep(10)
    driver.quit()
    print("Tarayıcı kapatıldı.")

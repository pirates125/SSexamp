import pyotp

# Secret key'i buraya girin (base32 format)
SECRET_KEY = "DD3JCJB7E7H25MB6BZ5IKXLKLJBZDQAO"

totp = pyotp.TOTP(SECRET_KEY)
print("Güncel TOTP Kodu:", totp.now())

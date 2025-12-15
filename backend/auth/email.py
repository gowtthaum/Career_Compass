import smtplib
from email.message import EmailMessage
import os

EMAIL = os.getenv("EMAIL_USER")
PASSWORD = os.getenv("EMAIL_PASS")

def send_otp_email(to_email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "Your Career Compass OTP"
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg.set_content(f"Your OTP is {otp}. It expires in 5 minutes.")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL, PASSWORD)
        server.send_message(msg)

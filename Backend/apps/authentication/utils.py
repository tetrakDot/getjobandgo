import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_otp(length=6):
    """
    Generate a random 6-digit OTP.
    """
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email, otp):
    """
    Send the OTP via email using Django's send_mail function.
    """
    subject = "Password Reset OTP - GetJobAndGo"
    message = f"Your OTP for password reset is: {otp}. It is valid for 5 minutes. Please do not share this with anyone."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    
    send_mail(subject, message, from_email, recipient_list)

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.companies.serializers import CompanyRegistrationSerializer

data = {
    "company_name": "TetraDot",
    "email": "company@gmail.com",
    "password": "password123",
    "phone": "9952860404",
    "company_type": "Startup",
    "country": "India",
    "state": "Tamil Nadu",
    "district": "Madurai",
    "gst_number": "000",
    "cin_number": "00"
}

# mock admin request? Let's just pass data to see what it complains about first.
serializer = CompanyRegistrationSerializer(data=data)
print("IS_VALID:", serializer.is_valid())
print("ERRORS:", serializer.errors)

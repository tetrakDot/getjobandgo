import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from apps.companies.views import CompanyViewSet
from apps.authentication.models import User, UserRole
from apps.companies.models import Company

# clean up
User.objects.filter(email="company_new_123@gmail.com").delete()
Company.objects.filter(email="company_new_123@gmail.com").delete()

# 1. create admin user
admin_user, _ = User.objects.get_or_create(email="admin_test@test.com", defaults={"role": UserRole.ADMIN})
admin_user.set_password("admin_pass")
admin_user.save()

# 2. setup request
factory = APIRequestFactory()
data = {
    "company_name": "TetraDot",
    "email": "company_new_123@gmail.com",
    "password": "password123",
    "phone": "9952860404",
    "company_type": "Startup",
    "country": "India",
    "state": "Tamil Nadu",
    "district": "Madurai",
    "gst_number": "GST_RANDOM",
    "cin_number": "CIN_RANDOM"
}
request = factory.post('/api/companies/', data, format='multipart')
force_authenticate(request, user=admin_user)

# 3. call view
view = CompanyViewSet.as_view({'post': 'create'})
response = view(request)

print("STATUS CODE:", response.status_code)
if response.status_code != 201:
    print("ERRORS:", json.dumps(response.data, indent=2))
else:
    print("SUCCESS: Company created")

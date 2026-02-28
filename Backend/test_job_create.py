import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from apps.jobs.views import JobViewSet
from apps.authentication.models import User

user = User.objects.get(email='company@gmail.com')

factory = APIRequestFactory()
data = {
    "title": "Python Developer",
    "description": "We are seeking Young Talent",
    "job_type": "intern",
    "salary": "10000",
    "location": "Madurai"
}
request = factory.post('/api/jobs/', data, format='json')
force_authenticate(request, user=user)

view = JobViewSet.as_view({'post': 'create'})
response = view(request)

print("STATUS CODE:", response.status_code)
print("RESPONSE DATA:", response.data)

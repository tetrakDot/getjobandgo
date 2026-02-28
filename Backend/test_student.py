import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from apps.students.views import StudentViewSet
from apps.authentication.models import User, UserRole
from apps.students.models import Student

admin_user, _ = User.objects.get_or_create(email="admin_test_students@test.com", defaults={"role": UserRole.ADMIN})
admin_user.set_password("admin_pass")
admin_user.save()

student_user, _ = User.objects.get_or_create(email="student_test@test.com", defaults={"role": UserRole.STUDENT})
student = student_user.student_profile
student.full_name = "Test Student"
student.save()

factory = APIRequestFactory()
request = factory.post(f'/api/students/{student.id}/verify/')
force_authenticate(request, user=admin_user)

view = StudentViewSet.as_view({'post': 'verify'})
try:
    response = view(request, id=str(student.id))
    print("STATUS CODE WITH id=:", response.status_code)
except Exception as e:
    print("Error calling with id=:", e)

try:
    response = view(request, pk=str(student.id))
    print("STATUS CODE WITH pk=:", response.status_code)
except Exception as e:
    print("Error calling with pk=:", e)

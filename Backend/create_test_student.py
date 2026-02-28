import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.authentication.models import User, UserRole
from apps.students.models import Student
from apps.students.serializers import StudentSerializer

user = User.objects.create_user(email="testuuid@example.com", password="password123", role=UserRole.STUDENT)
student = Student.objects.get(user=user)
student.full_name = "Jane Doe"
student.skills = "React, Django, Python"
student.save()

serializer = StudentSerializer(student)
print(json.dumps(serializer.data, indent=2))

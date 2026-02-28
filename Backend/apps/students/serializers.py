from rest_framework import serializers

from apps.authentication.models import User, UserRole
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    phone = serializers.CharField(allow_blank=True, required=False)
    skills = serializers.CharField(allow_blank=True, required=False)
    education = serializers.CharField(allow_blank=True, required=False)
    about = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Student
        fields = (
            "id",
            "full_name",
            "phone",
            "resume",
            "skills",
            "education",
            "about",
            "country",
            "state",
            "district",
            "verification_status",
            "created_at",
            "email",
            "role",
        )
        read_only_fields = ("id", "verification_status", "created_at", "email", "role")


class StudentRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(allow_blank=True, required=False)
    skills = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Student
        fields = ("id", "full_name", "phone", "resume", "skills", "country", "state", "district", "email", "password", "created_at")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        user = User.objects.create_user(email=email, password=password, role=UserRole.STUDENT)
        student, _ = Student.objects.update_or_create(user=user, defaults=validated_data)
        return student


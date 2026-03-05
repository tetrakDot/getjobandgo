from rest_framework import serializers

from apps.authentication.models import User, UserRole
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    phone = serializers.CharField(allow_blank=False, required=True)
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
    phone = serializers.CharField(allow_blank=False, required=True)
    skills = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Student
        fields = ("id", "full_name", "phone", "resume", "skills", "country", "state", "district", "email", "password", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_email(self, value):
        value = value.strip().lower()
        # Email must not already exist in the User table (covers both students and companies)
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email address already exists. Please log in instead."
            )
        return value

    def validate_phone(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        # Check uniqueness across students
        if Student.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This phone number is already registered with another student account."
            )
        # Check uniqueness across companies too
        from apps.companies.models import Company
        if Company.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This phone number is already registered with a company account."
            )
        return value

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        user = User.objects.create_user(email=email, password=password, role=UserRole.STUDENT)
        student, _ = Student.objects.update_or_create(user=user, defaults=validated_data)
        return student

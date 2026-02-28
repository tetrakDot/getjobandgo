from rest_framework import serializers

from apps.authentication.models import User, UserRole
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    company_description = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Company
        fields = (
            "id",
            "company_name",
            "email",
            "phone",
            "company_type",
            "company_description",
            "country",
            "state",
            "district",
            "gst_number",
            "cin_number",
            "verification_status",
            "incorporation_certificate",
            "pan_document",
            "founder_id_proof",
            "registration_proof",
            "admin_remarks",
            "created_at",
        )
        read_only_fields = ("id", "verification_status", "admin_remarks", "created_at")


class CompanyRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = (
            "id",
            "company_name",
            "email",
            "phone",
            "company_type",
            "country",
            "state",
            "district",
            "gst_number",
            "cin_number",
            "incorporation_certificate",
            "pan_document",
            "founder_id_proof",
            "registration_proof",
            "password",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate(self, attrs):
        request = self.context.get("request")
        is_admin = False
        if request and request.user and request.user.is_authenticated:
            if getattr(request.user, "role", None) in {UserRole.ADMIN, UserRole.SUPERADMIN}:
                is_admin = True

        company_type = attrs.get("company_type")
        if company_type and company_type.lower() == "startup" and not is_admin:
            required_docs = [
                "incorporation_certificate",
                "pan_document",
                "founder_id_proof",
                "registration_proof",
            ]
            missing = [field for field in required_docs if not attrs.get(field)]
            if missing:
                raise serializers.ValidationError(
                    {field: "This document is required for startups." for field in missing}
                )
        return attrs

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        user = User.objects.create_user(email=email, password=password, role=UserRole.COMPANY)
        
        # company profile is implicitly created via User post_save signal
        company = user.company_profile
        for attr, value in validated_data.items():
            setattr(company, attr, value)
        company.save()
        
        return company


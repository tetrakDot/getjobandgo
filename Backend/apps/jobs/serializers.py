from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.company_name", read_only=True)
    company_verification_status = serializers.CharField(source="company.verification_status", read_only=True)
    company_country = serializers.CharField(source="company.country", read_only=True)

    class Meta:
        model = Job
        fields = (
            "id",
            "company",
            "company_name",
            "company_verification_status",
            "company_country",
            "title",
            "description",
            "job_type",
            "salary",
            "salary_period",
            "location",
            "is_active",
            "created_at",
        )
        read_only_fields = ("id", "company_name", "company_verification_status", "company_country", "created_at")
        extra_kwargs = {
            "company": {"required": False}
        }


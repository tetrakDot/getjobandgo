from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    student_email = serializers.EmailField(source="student.user.email", read_only=True)
    student_skills = serializers.CharField(source="student.skills", read_only=True)
    student_verification_status = serializers.CharField(source="student.verification_status", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company.company_name", read_only=True)

    class Meta:
        model = Application
        fields = (
            "id",
            "student",
            "job",
            "status",
            "applied_at",
            "student_name",
            "student_email",
            "student_skills",
            "student_verification_status",
            "job_title",
            "company_name",
            "resume_snapshot",
        )
        read_only_fields = ("id", "student", "applied_at", "student_name", "student_email", "student_skills", "student_verification_status", "job_title", "company_name", "resume_snapshot")


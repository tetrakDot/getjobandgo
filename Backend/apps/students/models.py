import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


def student_resume_upload_path(instance: "Student", filename: str) -> str:
    return f"students/{instance.id or 'pending'}/resumes/{filename}"


class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    verification_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("verified", "Verified"),
            ("rejected", "Rejected"),
        ],
        default="pending",
        db_index=True,
    )
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    resume = models.FileField(upload_to=student_resume_upload_path, null=True, blank=True)
    skills = models.TextField(help_text="Comma-separated list of skills", blank=True)
    education = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} ({self.user.email})"


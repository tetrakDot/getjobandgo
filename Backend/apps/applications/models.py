from django.db import models
from django.utils import timezone

from apps.core.models import UUIDBaseModel
from apps.jobs.models import Job
from apps.students.models import Student


class ApplicationStatus(models.TextChoices):
    APPLIED = "applied", "Applied"
    UNDER_REVIEW = "under_review", "Under Review"
    SHORTLISTED = "shortlisted", "Shortlisted"
    REJECTED = "rejected", "Rejected"
    HIRED = "hired", "Hired"

def application_resume_upload_path(instance: "Application", filename: str) -> str:
    return f"applications/{instance.id or 'pending'}/resumes/{filename}"

class Application(UUIDBaseModel):
    resume_snapshot = models.FileField(upload_to=application_resume_upload_path, null=True, blank=True)
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="applications",
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
        db_index=True,
    )
    applied_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-applied_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "job"],
                name="unique_application_per_job",
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} -> {self.job} ({self.status})"


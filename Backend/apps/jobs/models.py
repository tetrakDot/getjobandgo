from django.db import models
from django.utils import timezone

from apps.core.models import UUIDBaseModel
from apps.companies.models import Company


class JobType(models.TextChoices):
    JOB = "job", "Job"
    INTERN = "intern", "Intern"


class SalaryPeriod(models.TextChoices):
    MONTHLY = "monthly", "Monthly"
    YEARLY = "yearly", "Yearly"


class Job(UUIDBaseModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        default=JobType.JOB,
    )
    salary = models.CharField(max_length=255)
    salary_period = models.CharField(
        max_length=20,
        choices=SalaryPeriod.choices,
        default=SalaryPeriod.YEARLY,
    )
    location = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} at {self.company.company_name}"


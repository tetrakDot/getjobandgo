from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.core.models import UUIDBaseModel
from apps.companies.models import Company


class CompanyVerificationAuditLog(UUIDBaseModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="verification_audit_logs",
    )
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_verification_actions",
    )
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.company.company_name}: {self.previous_status} -> {self.new_status}"


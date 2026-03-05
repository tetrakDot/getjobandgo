from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.core.models import UUIDBaseModel


class CompanyVerificationStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    VERIFIED = "verified", "Verified"
    REJECTED = "rejected", "Rejected"


def company_document_upload_path(instance: "Company", filename: str) -> str:
    return f"companies/{instance.id or 'pending'}/{filename}"


class Company(UUIDBaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="company_profile",
    )
    company_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    company_type = models.CharField(max_length=100)
    company_description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    gst_number = models.CharField(max_length=32, unique=True)
    cin_number = models.CharField(max_length=32, unique=True)
    verification_status = models.CharField(
        max_length=20,
        choices=CompanyVerificationStatus.choices,
        default=CompanyVerificationStatus.PENDING,
        db_index=True,
    )

    incorporation_certificate = models.FileField(
        upload_to=company_document_upload_path,
        null=True,
        blank=True,
    )
    pan_document = models.FileField(
        upload_to=company_document_upload_path,
        null=True,
        blank=True,
    )
    founder_id_proof = models.FileField(
        upload_to=company_document_upload_path,
        null=True,
        blank=True,
    )
    registration_proof = models.FileField(
        upload_to=company_document_upload_path,
        null=True,
        blank=True,
    )

    admin_remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                name="unique_company_email",
            )
        ]

    def __str__(self) -> str:
        return f"{self.company_name} ({self.email})"


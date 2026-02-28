from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "email",
        "company_type",
        "verification_status",
        "created_at",
    )
    list_filter = ("company_type", "verification_status", "created_at")
    search_fields = ("company_name", "email", "gst_number", "cin_number")
    ordering = ("-created_at",)


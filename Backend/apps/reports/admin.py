from django.contrib import admin

from .models import CompanyVerificationAuditLog


@admin.register(CompanyVerificationAuditLog)
class CompanyVerificationAuditLogAdmin(admin.ModelAdmin):
    list_display = ("company", "admin", "previous_status", "new_status", "created_at")
    list_filter = ("previous_status", "new_status", "created_at")
    search_fields = ("company__company_name", "admin__email")
    ordering = ("-created_at",)


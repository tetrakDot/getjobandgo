from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "is_active", "created_at")
    list_filter = ("is_active", "location", "created_at")
    search_fields = ("title", "company__company_name")
    ordering = ("-created_at",)


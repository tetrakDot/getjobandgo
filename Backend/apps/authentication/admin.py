from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "role", "is_active", "is_staff", "created_at")
    list_filter = ("role", "is_active", "is_staff", "is_superuser")
    search_fields = ("email",)
    ordering = ("-created_at",)

    def save_model(self, request, obj, form, change):
        if obj.password and not obj.password.startswith("pbkdf2_"):
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

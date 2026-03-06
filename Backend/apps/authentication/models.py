from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    SUPERADMIN = "superadmin", "Super Admin"
    ADMIN = "admin", "Admin"
    COMPANY = "company", "Company"
    STUDENT = "student", "Student"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email: str, password: str | None, role: str, **extra_fields):
        if not email:
            raise ValueError("The email address must be set.")
        if not role:
            raise ValueError("The role must be set.")

        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, role: str = UserRole.STUDENT, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", True)
        return self._create_user(email, password, role, **extra_fields)

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        role = extra_fields.pop("role", UserRole.SUPERADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, role, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=UserRole.choices, db_index=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now, editable=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"


class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = "password reset otp"
        verbose_name_plural = "password reset otps"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.email} - {self.otp}"

    @property
    def is_expired(self):
        # OTP valid for 5 minutes
        return timezone.now() > self.created_at + timezone.timedelta(minutes=5)


class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
    action = models.CharField(max_length=50) # login, logout, visit
    path = models.CharField(max_length=255, null=True, blank=True)  # Store specific page visited
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "user activity"
        verbose_name_plural = "user activities"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"


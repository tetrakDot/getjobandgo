from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.authentication.models import UserRole
from apps.authentication.permissions import IsAdminOrReadOnly, IsCompanyUser
from apps.companies.models import Company
from .models import Job
from .serializers import JobSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related("company", "company__user").all()
    serializer_class = JobSerializer
    filterset_fields = ("is_active", "location", "company")
    search_fields = ("title", "description", "company__company_name")
    ordering_fields = ("created_at", "title", "salary")
    
    lookup_field = "id"
    lookup_value_regex = r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action in {"create", "update", "partial_update", "destroy"}:
            from apps.authentication.permissions import IsAdminOrCompanyOrReadOnly
            return [IsAdminOrCompanyOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or user.role == UserRole.STUDENT:
            return self.queryset.filter(is_active=True)
        if user.role == UserRole.COMPANY:
            company = Company.objects.filter(user=user).first()
            if not company:
                return Job.objects.none()
            return self.queryset.filter(company=company)
        if user.role in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            return self.queryset
        return self.queryset.filter(is_active=True)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == UserRole.COMPANY:
            company = Company.objects.filter(user=user).first()
            if not company:
                raise PermissionDenied("Associated company profile not found.")
            if company.verification_status != "verified":
                raise PermissionDenied("Your company profile must be verified before you can post a job.")
            serializer.save(company=company)
        elif user.role in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            serializer.save()
        else:
            raise PermissionDenied("You are not allowed to create jobs.")

    def perform_update(self, serializer):
        job = self.get_object()
        user = self.request.user
        if user.role == UserRole.COMPANY and job.company.user != user:
            raise PermissionDenied("You are not allowed to modify this job.")
        if user.role == UserRole.STUDENT:
            raise PermissionDenied("You are not allowed to modify jobs.")
        serializer.save()


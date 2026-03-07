from django.db import transaction
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.authentication.models import UserRole
from apps.authentication.permissions import IsAdmin, IsCompanyUser
from apps.reports.models import CompanyVerificationAuditLog
from .models import Company, CompanyVerificationStatus
from .serializers import CompanyRegistrationSerializer, CompanySerializer


class CompanyViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Company.objects.select_related("user").all()
    filterset_fields = ("verification_status", "company_type", "created_at")
    search_fields = ("company_name", "email", "gst_number", "cin_number")
    ordering_fields = ("created_at", "company_name")
    
    lookup_field = "id"
    lookup_value_regex = r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

    def get_serializer_class(self):
        if self.action == "create":
            return CompanyRegistrationSerializer
        return CompanySerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action in {"pending", "verify", "reject", "destroy", "mark_pending"}:
            return [IsAdmin()]
        return [IsCompanyUser()]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset

        # Handle randomization if requested
        random_count = self.request.query_params.get("random")
        if random_count:
            try:
                count = int(random_count)
                # Public or Students only see verified companies
                if not user.is_authenticated or user.role == UserRole.STUDENT:
                    queryset = queryset.filter(verification_status=CompanyVerificationStatus.VERIFIED)
                return queryset.order_by("?")[:count]
            except (ValueError, TypeError):
                pass

        if not user.is_authenticated:
            return queryset.filter(verification_status=CompanyVerificationStatus.VERIFIED)
        if user.role in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            return queryset
        if user.role == UserRole.STUDENT:
            return queryset.filter(verification_status=CompanyVerificationStatus.VERIFIED)
        if user.role == UserRole.COMPANY:
            if self.action in {"list", "retrieve"}:
                return queryset.filter(verification_status=CompanyVerificationStatus.VERIFIED) | queryset.filter(user=user)
            return queryset.filter(user=user)
        return Company.objects.none()

    def perform_destroy(self, instance):
        # Deleting the user will cascade and delete the company profile
        instance.user.delete()

    def perform_update(self, serializer):
        company = self.get_object()
        user = self.request.user
        if company.user != user and user.role not in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            raise PermissionDenied("You are not allowed to update this company.")
        serializer.save()

    @action(detail=False, methods=["get"])
    def me(self, request):
        if not hasattr(request.user, 'company_profile'):
             return Response({"detail": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
             
        serializer = self.get_serializer(request.user.company_profile)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def pending(self, request):
        queryset = self.get_queryset().filter(verification_status=CompanyVerificationStatus.PENDING)
        page = self.paginate_queryset(queryset)
        serializer = CompanySerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["post"])
    def verify(self, request, id=None):
        company = self.get_object()
        previous_status = company.verification_status
        company.verification_status = CompanyVerificationStatus.VERIFIED
        company.admin_remarks = request.data.get("admin_remarks", "")
        with transaction.atomic():
            company.save(update_fields=["verification_status", "admin_remarks"])
            CompanyVerificationAuditLog.objects.create(
                company=company,
                admin=request.user,
                previous_status=previous_status,
                new_status=company.verification_status,
                remarks=company.admin_remarks,
            )
        return Response(CompanySerializer(company).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, id=None):
        company = self.get_object()
        previous_status = company.verification_status
        company.verification_status = CompanyVerificationStatus.REJECTED
        company.admin_remarks = request.data.get("admin_remarks", "")
        with transaction.atomic():
            company.save(update_fields=["verification_status", "admin_remarks"])
            CompanyVerificationAuditLog.objects.create(
                company=company,
                admin=request.user,
                previous_status=previous_status,
                new_status=company.verification_status,
                remarks=company.admin_remarks,
            )
        return Response(CompanySerializer(company).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def mark_pending(self, request, id=None):
        company = self.get_object()
        previous_status = company.verification_status
        company.verification_status = CompanyVerificationStatus.PENDING
        company.admin_remarks = request.data.get("admin_remarks", "")
        with transaction.atomic():
            company.save(update_fields=["verification_status", "admin_remarks"])
            CompanyVerificationAuditLog.objects.create(
                company=company,
                admin=request.user,
                previous_status=previous_status,
                new_status=company.verification_status,
                remarks=company.admin_remarks,
            )
        return Response(CompanySerializer(company).data, status=status.HTTP_200_OK)


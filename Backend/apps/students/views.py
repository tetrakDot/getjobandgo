from rest_framework import mixins, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.authentication.models import UserRole
from apps.authentication.permissions import IsAdmin, IsStudentUser
from django.http import FileResponse, Http404
import os
from .models import Student
from .serializers import StudentRegistrationSerializer, StudentSerializer


class StudentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Student.objects.select_related("user").all()
    filterset_fields = ("created_at", "verification_status")
    search_fields = ("full_name", "user__email", "skills", "education")
    ordering_fields = ("created_at", "full_name")
    
    lookup_field = "id"
    lookup_value_regex = r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

    def get_serializer_class(self):
        if self.action == "create":
            return StudentRegistrationSerializer
        return StudentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action == "download_resume":
            return [permissions.IsAuthenticated()]
        if self.action in {"destroy", "verify", "reject", "mark_pending"}:
            return [IsAdmin()]
        return [IsStudentUser()]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset

        # Handle randomization if requested
        random_count = self.request.query_params.get("random")
        if random_count:
            try:
                count = int(random_count)
                # If student is browsing, only show verified students
                if user.is_authenticated and user.role == UserRole.STUDENT:
                    # Students usually shouldn't see each other unless allowed? 
                    # But the requirement says "browse talents" for both.
                    # Usually companies browse talents.
                    pass
                
                # Default behavior for browsing: show verified
                # Unless it's an admin
                if not user.is_authenticated or user.role not in {UserRole.ADMIN, UserRole.SUPERADMIN}:
                    queryset = queryset.filter(verification_status="verified")
                
                return queryset.order_by("?")[:count]
            except (ValueError, TypeError):
                pass

        if not user.is_authenticated:
            return queryset.filter(verification_status="verified")
            
        if user.role in {UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.COMPANY}:
            return queryset
            
        if user.role == UserRole.STUDENT:
            if self.action in {"list", "retrieve"}:
                return queryset.filter(verification_status="verified")
            return queryset.filter(user=user)
            
        return queryset.filter(user=user)

    def perform_destroy(self, instance):
        # Deleting the user will cascade and delete the student profile
        instance.user.delete()

    def perform_update(self, serializer):
        student = self.get_object()
        user = self.request.user
        if student.user != user and user.role not in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            raise PermissionDenied("You are not allowed to update this profile.")
        serializer.save()

    @action(detail=True, methods=["post"])
    def verify(self, request, id=None):
        student = self.get_object()
        student.verification_status = "verified"
        student.save()
        return Response({"status": "Student verified"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, id=None):
        student = self.get_object()
        student.verification_status = "rejected"
        student.save()
        return Response({"status": "Student rejected"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def mark_pending(self, request, id=None):
        student = self.get_object()
        student.verification_status = "pending"
        student.save()
        return Response({"status": "Student marked as pending"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="download-resume")
    def download_resume(self, request, id=None):
        student = self.get_object()
        if not student.resume:
            raise Http404("Resume not found.")
            
        try:
            file_handle = student.resume.open()
            filename = os.path.basename(student.resume.name)
            response = FileResponse(file_handle, as_attachment=True, filename=filename)
            return response
        except FileNotFoundError:
            raise Http404("Resume physical file is missing from server.")


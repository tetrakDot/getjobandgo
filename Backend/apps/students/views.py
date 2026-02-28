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
    search_fields = ("full_name", "user__email", "skills")
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
        if self.action in {"list", "retrieve", "download_resume"}:
            return [permissions.IsAuthenticated()]
        if self.action in {"destroy", "verify", "reject", "mark_pending"}:
            return [IsAdmin()]
        return [IsStudentUser()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Student.objects.none()
        if user.role in {UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.COMPANY}:
            return self.queryset
        if user.role == UserRole.STUDENT:
            if self.action in {"list", "retrieve"}:
                return self.queryset
            return self.queryset.filter(user=user)
        return self.queryset.filter(user=user)

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


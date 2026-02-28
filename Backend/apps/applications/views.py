from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.authentication.models import UserRole
from apps.authentication.permissions import IsAdmin
from apps.students.models import Student
from .models import Application
from .serializers import ApplicationSerializer
from rest_framework.decorators import action
from django.http import FileResponse, Http404
import os
from django.core.files.base import ContentFile


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = (
        Application.objects.select_related("student", "student__user", "job", "job__company")
        .all()
    )
    serializer_class = ApplicationSerializer
    filterset_fields = ("status", "job")
    search_fields = ("student__full_name", "job__title", "job__company__company_name")
    ordering_fields = ("applied_at",)
    
    lookup_field = "id"
    lookup_value_regex = r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.IsAuthenticated()]
        if self.action in {"update", "partial_update"}:
            from apps.authentication.permissions import IsAdminOrCompany
            return [IsAdminOrCompany()]
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        if self.action == "destroy":
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()
        if user.role in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            return self.queryset
        if user.role == UserRole.STUDENT:
            return self.queryset.filter(student__user=user)
        if user.role == UserRole.COMPANY:
            return self.queryset.filter(job__company__user=user)
        return Application.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == UserRole.STUDENT:
            student = Student.objects.filter(user=user).first()
            if not student:
                raise PermissionDenied("Student profile not found.")
        elif user.role in {UserRole.ADMIN, UserRole.SUPERADMIN}:
            student = serializer.validated_data.get("student")
            if not student:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"student": "Admins must explicitly provide a student."})
        else:
            raise PermissionDenied("Only students and admins can apply to jobs.")
            
        job = serializer.validated_data.get("job")
        if Application.objects.filter(student=student, job=job).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You have already applied to this job.")
            
        if student.resume:
            try:
                try:
                    student.resume.open()
                    resume_content = student.resume.read()
                    resume_name = os.path.basename(student.resume.name)
                    serializer.save(
                        student=student,
                        resume_snapshot=ContentFile(resume_content, name=resume_name),
                    )
                except Exception:
                    # Fallback if the physical file does not exist
                    serializer.save(student=student)
            finally:
                if not student.resume.closed:
                    student.resume.close()
        else:
            serializer.save(student=student)



    @action(detail=True, methods=["get"], url_path="download-resume")
    def download_resume(self, request, id=None):
        application = self.get_object()
        if not application.resume_snapshot:
            raise Http404("Resume not found.")
            
        try:
            file_handle = application.resume_snapshot.open()
            filename = os.path.basename(application.resume_snapshot.name)
            response = FileResponse(file_handle, as_attachment=True, filename=filename)
            return response
        except FileNotFoundError:
            raise Http404("Resume physical file is missing from server.")

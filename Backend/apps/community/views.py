from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ThoughtPost
from .serializers import ThoughtPostSerializer, AdminThoughtPostSerializer
from apps.students.models import Student
from apps.companies.models import Company


class IsVerifiedUser(permissions.BasePermission):
    """
    Only allow users whose student/company profile has verification_status == 'verified'.
    """
    message = "Your account must be verified to access the Career Wall."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # Admin / superuser always allowed
        if user.is_staff or user.is_superuser:
            return True
        try:
            if user.role == 'student':
                student = Student.objects.get(user=user)
                return student.verification_status == 'verified'
            elif user.role == 'company':
                company = Company.objects.get(user=user)
                return company.verification_status == 'verified'
        except (Student.DoesNotExist, Company.DoesNotExist):
            return False
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class ThoughtPostViewSet(viewsets.ModelViewSet):
    queryset = ThoughtPost.objects.all()
    serializer_class = ThoughtPostSerializer
    permission_classes = [IsVerifiedUser, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role_type', 'user']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsVerifiedUser])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
            return Response({'status': 'unliked', 'likes_count': post.likes.count(), 'is_liked': False})
        else:
            post.likes.add(user)
            return Response({'status': 'liked', 'likes_count': post.likes.count(), 'is_liked': True})


class AdminThoughtPostViewSet(viewsets.ModelViewSet):
    queryset = ThoughtPost.objects.all()
    serializer_class = AdminThoughtPostSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role_type']
    search_fields = ['title', 'description']


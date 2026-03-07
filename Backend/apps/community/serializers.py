from rest_framework import serializers
from .models import ThoughtPost
from apps.students.models import Student
from apps.companies.models import Company

class ThoughtPostSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    profile_id = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = ThoughtPost
        fields = ['id', 'user', 'user_name', 'profile_id', 'role_type', 'title', 'description', 'resume_file', 'likes_count', 'is_liked', 'created_at']
        read_only_fields = ['id', 'user', 'role_type', 'created_at', 'user_name', 'profile_id', 'likes_count', 'is_liked']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_profile_id(self, obj):
        try:
            if obj.role_type == 'student':
                student = Student.objects.get(user=obj.user)
                return student.id
            elif obj.role_type == 'company':
                company = Company.objects.get(user=obj.user)
                return company.id
        except (Student.DoesNotExist, Company.DoesNotExist):
            pass
        return None

    def get_user_name(self, obj):
        try:
            if obj.role_type == 'student':
                student = Student.objects.get(user=obj.user)
                return student.full_name
            elif obj.role_type == 'company':
                company = Company.objects.get(user=obj.user)
                return company.company_name
        except (Student.DoesNotExist, Company.DoesNotExist):
            pass
        return "Unknown User"

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['role_type'] = user.role
        return super().create(validated_data)


class AdminThoughtPostSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()

    class Meta:
        model = ThoughtPost
        fields = ['id', 'user', 'user_name', 'user_email', 'role_type', 'title', 'description', 'resume_file', 'likes_count', 'liked_by', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by(self, obj):
        users = obj.likes.all()
        result = []
        for u in users:
            name = u.email
            role = u.role
            try:
                if role == 'student':
                    student = Student.objects.get(user=u)
                    name = student.full_name
                elif role == 'company':
                    company = Company.objects.get(user=u)
                    name = company.company_name
            except (Student.DoesNotExist, Company.DoesNotExist):
                pass
            result.append({'id': u.id, 'name': name, 'email': u.email, 'role': role})
        return result

    def get_user_name(self, obj):
        try:
            if obj.role_type == 'student':
                student = Student.objects.get(user=obj.user)
                return student.full_name
            elif obj.role_type == 'company':
                company = Company.objects.get(user=obj.user)
                return company.company_name
        except (Student.DoesNotExist, Company.DoesNotExist):
            pass
        return obj.user.email

    def get_user_email(self, obj):
        return obj.user.email

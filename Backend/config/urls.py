from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.students.views import StudentViewSet
from apps.companies.views import CompanyViewSet
from apps.jobs.views import JobViewSet
from apps.applications.views import ApplicationViewSet
from apps.reports.views import DashboardStatsView, HelpRequestViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'help', HelpRequestViewSet, basename='help')
from django.conf import settings
from django.conf.urls.static import static


class PlatformStatsView(APIView):
    """Public endpoint — returns live counts of students and companies."""
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.students.models import Student
        from apps.companies.models import Company

        student_count = Student.objects.count()
        company_count = Company.objects.count()

        def format_count(n):
            if n >= 100:
                return "100+"
            return str(n)

        return Response({
            "students": student_count,
            "companies": company_count,
            "students_display": format_count(student_count),
            "companies_display": format_count(company_count),
        })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/reports/dashboard/", DashboardStatsView.as_view(), name='dashboard_stats'),
    path("api/platform-stats/", PlatformStatsView.as_view(), name='platform_stats'),
    path("api/2ex/", include("apps.evaluator.urls")),
    path("api/community/", include("apps.community.urls")),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

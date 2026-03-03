from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.students.views import StudentViewSet
from apps.companies.views import CompanyViewSet
from apps.jobs.views import JobViewSet
from apps.applications.views import ApplicationViewSet
from apps.reports.views import DashboardStatsView

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/reports/dashboard/", DashboardStatsView.as_view(), name='dashboard_stats'),
    path("api/2ex/", include("apps.evaluator.urls")),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

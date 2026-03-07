from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count
from django.db.models.functions import TruncMonth

from apps.authentication.permissions import IsAdmin
from apps.students.models import Student
from apps.companies.models import Company, CompanyVerificationStatus
from apps.jobs.models import Job
from apps.applications.models import Application

from apps.authentication.models import UserActivity
from django.db.models import Count
from django.db.models.functions import TruncMonth

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        total_students = Student.objects.count()
        total_companies = Company.objects.count()
        verified_companies = Company.objects.filter(verification_status=CompanyVerificationStatus.VERIFIED).count()
        active_jobs = Job.objects.filter(is_active=True).count()
        total_applications = Application.objects.count()

        # Login/Logout counts
        login_count = UserActivity.objects.filter(action='login').count()
        logout_count = UserActivity.objects.filter(action='logout').count()

        # Geographical breakdown (Students)
        student_geo = Student.objects.values('country', 'state', 'district').annotate(count=Count('id')).order_by('-count')[:5]
        student_geo_list = []
        for g in student_geo:
            parts = [str(p).strip() for p in [g.get('district'), g.get('state'), g.get('country')] if p and str(p).strip()]
            name = ", ".join(parts) if parts else "Unknown"
            student_geo_list.append({"name": name, "count": g['count']})

        # Geographical breakdown (Companies)
        company_geo = Company.objects.values('country', 'state', 'district').annotate(count=Count('id')).order_by('-count')[:5]
        company_geo_list = []
        for g in company_geo:
            parts = [str(p).strip() for p in [g.get('district'), g.get('state'), g.get('country')] if p and str(p).strip()]
            name = ", ".join(parts) if parts else "Unknown"
            company_geo_list.append({"name": name, "count": g['count']})

        # Group companies by month
        company_months = Company.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(c=Count('id')).order_by('month')[:6]
        # Group applications by month
        app_months = Application.objects.annotate(month=TruncMonth('applied_at')).values('month').annotate(c=Count('id')).order_by('month')[:6]

        company_growth = [{"name": m['month'].strftime("%b") if m['month'] else "N/A", "count": m['c']} for m in company_months]
        applications_growth = [{"name": m['month'].strftime("%b") if m['month'] else "N/A", "count": m['c']} for m in app_months]

        # Handle empty states
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        if not company_growth:
             company_growth = [{"name": month, "count": 0} for month in month_names[:6]]
        if not applications_growth:
             applications_growth = [{"name": month, "count": 0} for month in month_names[:6]]

        # Page visits
        page_visits_qs = UserActivity.objects.filter(action='visit').exclude(path__isnull=True).exclude(path='Unknown').values('path').annotate(count=Count('id')).order_by('-count')[:5]
        page_visits = [{"name": v['path'], "count": v['count']} for v in page_visits_qs]

        data = {
            "total_students": total_students,
            "total_companies": total_companies,
            "verified_companies": verified_companies,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "login_count": login_count,
            "logout_count": logout_count,
            "student_geo": student_geo_list,
            "company_geo": company_geo_list,
            "company_growth": company_growth,
            "applications_growth": applications_growth,
            "page_visits": page_visits,
        }
        return Response(data)


from .models import HelpRequest
from .serializers import HelpRequestSerializer

class HelpRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Help Requests.
    Users can POST. Admins can do everything.
    """
    queryset = HelpRequest.objects.all()
    serializer_class = HelpRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdmin()]


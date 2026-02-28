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

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        total_students = Student.objects.count()
        total_companies = Company.objects.count()
        verified_companies = Company.objects.filter(verification_status=CompanyVerificationStatus.VERIFIED).count()
        active_jobs = Job.objects.filter(is_active=True).count()
        total_applications = Application.objects.count()

        # Group companies by month
        company_months = Company.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(c=Count('id')).order_by('month')[:6]
        # Group applications by month
        app_months = Application.objects.annotate(month=TruncMonth('applied_at')).values('month').annotate(c=Count('id')).order_by('month')[:6]

        company_growth = [{"name": m['month'].strftime("%b") if m['month'] else "N/A", "count": m['c']} for m in company_months]
        applications_growth = [{"name": m['month'].strftime("%b") if m['month'] else "N/A", "count": m['c']} for m in app_months]

        # Handle empty states so charts don't crash nicely
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        if not company_growth:
             company_growth = [{"name": month, "count": 0} for month in month_names[:6]]
        if not applications_growth:
             applications_growth = [{"name": month, "count": 0} for month in month_names[:6]]

        data = {
            "total_students": total_students,
            "total_companies": total_companies,
            "verified_companies": verified_companies,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "company_growth": company_growth,
            "applications_growth": applications_growth,
        }
        return Response(data)

from rest_framework import serializers
from .models import HelpRequest


class DashboardStatsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_companies = serializers.IntegerField()
    verified_companies = serializers.IntegerField()
    active_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()


class MonthlyGrowthPointSerializer(serializers.Serializer):
    month = serializers.CharField()
    count = serializers.IntegerField()


class DashboardReportSerializer(serializers.Serializer):
    stats = DashboardStatsSerializer()
    company_growth = MonthlyGrowthPointSerializer(many=True)
    applications_growth = MonthlyGrowthPointSerializer(many=True)


class HelpRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpRequest
        fields = ['id', 'name', 'email', 'description', 'is_resolved', 'created_at']
        read_only_fields = ['id', 'created_at']


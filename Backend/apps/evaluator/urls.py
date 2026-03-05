from django.urls import path
from .views import EvaluateResumeView, ResumeEvaluationListView, ResumeEvaluationDetailView

urlpatterns = [
    path('evaluate/', EvaluateResumeView.as_view(), name='evaluate_resume'),
    path('logs/', ResumeEvaluationListView.as_view(), name='evaluation_logs'),
    path('logs/<int:pk>/', ResumeEvaluationDetailView.as_view(), name='evaluation_detail'),
]

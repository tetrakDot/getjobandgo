from django.urls import path
from .views import EvaluateResumeView

urlpatterns = [
    path('evaluate/', EvaluateResumeView.as_view(), name='evaluate_resume'),
]

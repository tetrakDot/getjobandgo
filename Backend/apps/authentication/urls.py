from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView, 
    MeView, 
    PasswordChangeView,
    LogoutView,
    UserActivityListView,
    UserActivityDetailView,
    UserActivityClearAllView,
    ForgotPasswordView,
    VerifyOTPView,
    ResetPasswordView
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("password/", PasswordChangeView.as_view(), name="change_password"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("activities/", UserActivityListView.as_view(), name="user_activities"),
    path("activities/<int:pk>/", UserActivityDetailView.as_view(), name="user_activity_detail"),
    path("activities/clear-all/", UserActivityClearAllView.as_view(), name="clear_all_activities"),
    
    # Forgot Password Flow
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify_otp"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
]

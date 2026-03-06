from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer, 
    UserSerializer, 
    PasswordChangeSerializer,
    UserActivitySerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer
)

from .models import User, UserActivity, PasswordResetOTP
from .utils import generate_otp, send_otp_email

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            try:
                # Log login
                user = User.objects.get(email=request.data.get("email"))
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip = x_forwarded_for.split(',')[0]
                else:
                    ip = request.META.get('REMOTE_ADDR')
                
                UserActivity.objects.create(
                    user=user,
                    action="login",
                    ip_address=ip,
                    user_agent=request.META.get('HTTP_USER_AGENT')
                )
            except Exception as e:
                print(f"Failed to log login: {e}")
        return response


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        UserActivity.objects.create(
            user=request.user,
            action="logout",
            ip_address=ip,
            user_agent=request.META.get('HTTP_USER_AGENT')
        )
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class LogVisitView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        user = request.user if request.user.is_authenticated else None
        path = request.data.get('path', 'Unknown')

        UserActivity.objects.create(
            user=user,
            action="visit",
            path=path,
            ip_address=ip,
            user_agent=request.META.get('HTTP_USER_AGENT')
        )
        return Response({"detail": "Visit logged."}, status=status.HTTP_200_OK)


class UserActivityListView(generics.ListAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Restriction: Only allow admin or superadmin to see activity logs
        if self.request.user.role in ['admin', 'superadmin'] or self.request.user.is_staff:
            return UserActivity.objects.all().select_related('user')
        return UserActivity.objects.none()

class UserActivityDetailView(generics.DestroyAPIView):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ['admin', 'superadmin'] or self.request.user.is_staff:
            return UserActivity.objects.all()
        return UserActivity.objects.none()

class UserActivityClearAllView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        if self.request.user.role in ['admin', 'superadmin'] or self.request.user.is_staff:
            count = UserActivity.objects.all().count()
            UserActivity.objects.all().delete()
            return Response({"detail": f"Successfully cleared {count} logs."}, status=status.HTTP_200_OK)
        return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        from django.conf import settings
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()
        
        # Invalidate old OTPs for this email
        PasswordResetOTP.objects.filter(email__iexact=email).delete()
        
        # Generate and save new OTP
        otp = generate_otp()
        PasswordResetOTP.objects.create(email=email, otp=otp)
        
        # Send OTP via email
        email_sent = False
        email_error = None
        try:
            send_otp_email(email, otp)
            email_sent = True
        except Exception as e:
            email_error = str(e)
            print(f"SMTP Error: {email_error}")

        if email_sent:
            return Response({"detail": "OTP sent to your email."}, status=status.HTTP_200_OK)
        else:
            # If email fails but we are in DEBUG mode, return the OTP so the user can test
            if settings.DEBUG:
                return Response({
                    "detail": f"Email service unavailable, but here is your code for testing: {otp}",
                    "otp_code": otp,
                    "warning": f"SMTP Error: {email_error}"
                }, status=status.HTTP_200_OK)
            
            return Response({
                "detail": f"Failed to send email. Please check your SMTP settings. Error: {email_error}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()
        otp_val = serializer.validated_data['otp']
        
        otp_obj = PasswordResetOTP.objects.filter(email__iexact=email, otp=otp_val).first()
        
        if not otp_obj:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_obj.is_expired:
            return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
            
        otp_obj.is_verified = True
        otp_obj.save()
        
        return Response({"detail": "OTP verified successfully."}, status=status.HTTP_200_OK)


class ResetPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()
        new_password = serializer.validated_data['new_password']
        
        otp_obj = PasswordResetOTP.objects.filter(email__iexact=email, is_verified=True).first()
        
        if not otp_obj:
            return Response({"detail": "OTP not verified. Please verify OTP first."}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_obj.is_expired:
            return Response({"detail": "Session expired. Please request a new OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Update user password
        try:
            user = User.objects.get(email__iexact=email)
            user.set_password(new_password)
            user.save()
            
            # Delete OTP after successful reset
            otp_obj.delete()
            
            return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

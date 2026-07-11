# users/views.py
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import datetime
import logging

from .serializers import (
    CustomerSignupSerializer,
    UserProfileSerializer,
    StaffCreateSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


# ─── Custom Permission ─────────────────────────────────────────────────────────
class IsStaffOrAdmin(BasePermission):
    """Allow access only to staff or admin users."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


# ─── Email Helpers ─────────────────────────────────────────────────────────────
def send_staff_welcome_email(user, plain_password):
    try:
        login_url = "http://localhost:5173/staff-login"
        year      = datetime.datetime.now().year

        context = {
            'first_name': user.first_name,
            'last_name':  user.last_name,
            'email':      user.email,
            'password':   plain_password,
            'login_url':  login_url,
            'year':       year,
        }

        html_body = render_to_string('emails/staff_welcome.html', context)
        text_body = (
            f"Welcome to ReTech, {user.first_name}!\n\n"
            f"Your staff account has been created.\n\n"
            f"Login credentials:\n"
            f"  Email:    {user.email}\n"
            f"  Password: {plain_password}\n\n"
            f"Login here: {login_url}\n\n"
            f"Please change your password after your first login.\n\n"
            f"— ReTech Team"
        )

        email = EmailMultiAlternatives(
            subject    = "Welcome to ReTech — Your Staff Account Details",
            body       = text_body,
            from_email = settings.DEFAULT_FROM_EMAIL,
            to         = [user.email],
        )
        email.attach_alternative(html_body, "text/html")
        email.send(fail_silently=False)
        logger.info(f"Welcome email sent to {user.email}")

    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {e}")


def send_password_reset_email(user):
    """
    Generates a secure uid+token pair (Django's default_token_generator,
    same mechanism used by Django's built-in password reset) and emails
    the staff member a link to reset their password.
    """
    try:
        uid       = urlsafe_base64_encode(force_bytes(user.pk))
        token     = default_token_generator.make_token(user)
        reset_url = f"http://localhost:5173/reset-password/{uid}/{token}"
        year      = datetime.datetime.now().year

        context = {
            'first_name': user.first_name,
            'reset_url':  reset_url,
            'year':       year,
        }

        html_body = render_to_string('emails/password_reset.html', context)
        text_body = (
            f"Hi {user.first_name},\n\n"
            f"You requested a password reset for your ReTech account.\n\n"
            f"Click the link below to reset your password:\n"
            f"{reset_url}\n\n"
            f"This link expires in 24 hours.\n\n"
            f"If you did not request this, you can safely ignore this email.\n\n"
            f"— ReTech Team"
        )

        email = EmailMultiAlternatives(
            subject    = "ReTech — Reset Your Password",
            body       = text_body,
            from_email = settings.DEFAULT_FROM_EMAIL,
            to         = [user.email],
        )
        email.attach_alternative(html_body, "text/html")
        email.send(fail_silently=False)
        logger.info(f"Password reset email sent to {user.email}")

    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {e}")


# ─── Customer Views ────────────────────────────────────────────────────────────
class CustomerSignupView(CreateAPIView):
    """POST /api/users/signup/"""
    serializer_class   = CustomerSignupSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user    = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Customer account created successfully',
            'user': {
                'id':            user.id,
                'email':         user.email,
                'first_name':    user.first_name,
                'last_name':     user.last_name,
                'full_name':     f"{user.first_name} {user.last_name}".strip(),
                'phone':         user.phone,
                'business_name': user.business_name or '',
                'role':          user.role,
            },
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """GET /api/users/me/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


# ─── Admin Login ───────────────────────────────────────────────────────────────
class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'


class AdminLoginView(TokenObtainPairView):
    """POST /api/users/admin/login/ — admin accounts only"""
    serializer_class   = AdminTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data.get('email'))
            if user.role != 'admin':
                raise PermissionDenied("You are not authorized to access the admin panel.")
        except User.DoesNotExist:
            raise PermissionDenied("Invalid credentials.")
        return response


class StaffLoginView(TokenObtainPairView):
    """POST /api/users/staff/login/ — staff accounts only"""
    serializer_class   = AdminTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data.get('email'))
            if user.role != 'staff':
                raise PermissionDenied("You are not authorized to access the staff panel.")
        except User.DoesNotExist:
            raise PermissionDenied("Invalid credentials.")
        return response

# ─── Password Reset ────────────────────────────────────────────────────────────
class PasswordResetRequestView(APIView):
    """
    POST /api/users/password-reset/
    Body: { "email": "staff@example.com" }
    Always returns the same success message regardless of whether the
    email exists, to prevent user enumeration attacks.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            if user.is_staff:
                send_password_reset_email(user)
        except User.DoesNotExist:
            pass  # Silently ignore — don't reveal whether the email exists

        return Response({'message': 'If this email exists, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
    """
    POST /api/users/password-reset/confirm/
    Body: { "uid": "...", "token": "...", "password": "new_password" }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uid      = request.data.get('uid', '')
        token    = request.data.get('token', '')
        password = request.data.get('password', '')

        if not all([uid, token, password]):
            return Response(
                {'error': 'uid, token and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user    = User.objects.get(pk=user_id)
        except (TypeError, ValueError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'This reset link has expired or already been used.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()
        return Response({'message': 'Password reset successfully. You can now log in.'})


# ─── Staff Management ──────────────────────────────────────────────────────────
class AdminStaffListView(APIView):
    """GET /api/users/admin/staff/"""
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        staff = User.objects.filter(is_staff=True).order_by('-date_joined')
        data  = [
            {
                'id':           u.id,
                'email':        u.email,
                'first_name':   u.first_name,
                'last_name':    u.last_name,
                'phone':        u.phone,
                'role':         u.role,
                'is_active':    u.is_active,
                'is_superuser': u.is_superuser,
                'date_joined':  u.date_joined,
                'last_login':   u.last_login,
            }
            for u in staff
        ]
        return Response(data)


class AdminStaffCreateView(APIView):
    """POST /api/users/admin/staff/create/"""
    permission_classes = [IsStaffOrAdmin]

    def post(self, request):
        serializer = StaffCreateSerializer(data=request.data)
        if serializer.is_valid():
            plain_password = request.data.get('password', '')
            user = serializer.save()
            send_staff_welcome_email(user, plain_password)
            return Response({
                'message':    f'Staff account created. Login credentials emailed to {user.email}.',
                'email_sent': True,
                'user': {
                    'id':           user.id,
                    'email':        user.email,
                    'first_name':   user.first_name,
                    'last_name':    user.last_name,
                    'phone':        user.phone,
                    'role':         user.role,
                    'is_active':    user.is_active,
                    'is_superuser': user.is_superuser,
                    'date_joined':  user.date_joined,
                    'last_login':   user.last_login,
                },
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminStaffToggleActiveView(APIView):
    """PATCH /api/users/admin/staff/<int:pk>/toggle/"""
    permission_classes = [IsStaffOrAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, is_staff=True)
        except User.DoesNotExist:
            return Response(
                {'error': 'Staff member not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if user.is_superuser:
            return Response(
                {'error': 'Cannot deactivate a superuser account.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        user.is_active = not user.is_active
        user.save()
        return Response({
            'message':   f"Account {'activated' if user.is_active else 'deactivated'} successfully.",
            'is_active': user.is_active,
        })
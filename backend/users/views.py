# users/views.py
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import CustomerSignupSerializer, UserProfileSerializer, StaffCreateSerializer

User = get_user_model()


class CustomerSignupView(CreateAPIView):
    serializer_class = CustomerSignupSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Customer account created successfully',
            'user': {
                'id': user.id, 'email': user.email,
                'first_name': user.first_name, 'last_name': user.last_name,
                'full_name': f"{user.first_name} {user.last_name}".strip(),
                'phone': user.phone, 'business_name': user.business_name or '',
                'role': user.role,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'


class AdminLoginView(TokenObtainPairView):
    """POST /api/users/admin/login/ — staff/admin only JWT login"""
    serializer_class = AdminTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data.get('email'))
        except User.DoesNotExist:
            raise PermissionDenied("Invalid credentials.")
        if not user.is_staff:
            raise PermissionDenied("You are not authorized to access the admin panel.")
        return response


class AdminStaffListView(APIView):
    """GET /api/users/admin/staff/ — list all staff/admin users"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        staff = User.objects.filter(is_staff=True).order_by('-date_joined')
        data = [
            {
                'id': u.id, 'username': u.username, 'email': u.email,
                'first_name': u.first_name, 'last_name': u.last_name,
                'role': u.role, 'is_active': u.is_active,
                'date_joined': u.date_joined,
            }
            for u in staff
        ]
        return Response(data)


class AdminStaffCreateView(APIView):
    """POST /api/users/admin/staff/create/ — admin creates a staff account"""
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = StaffCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': f'Staff account created for {user.email}',
                'user': {
                    'id': user.id, 'username': user.username,
                    'email': user.email, 'first_name': user.first_name,
                    'last_name': user.last_name, 'role': user.role,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# users/views.py
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CustomerSignupSerializer, UserProfileSerializer
from rest_framework.authtoken.models import Token
# If you're using JWT instead → from rest_framework_simplejwt.tokens import RefreshToken


class CustomerSignupView(CreateAPIView):
    """
    API endpoint for customer registration.
    Creates a new user with role='customer' and returns basic user info + auth token.
    """
    serializer_class = CustomerSignupSerializer
    permission_classes = [AllowAny]           # Anyone can register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Option 1: Return Token (most common for session/token auth)
        token, _ = Token.objects.get_or_create(user=user)
        
        # Option 2: If using JWT → uncomment below and comment Token line
        # refresh = RefreshToken.for_user(user)
        # tokens = {
        #     'refresh': str(refresh),
        #     'access': str(refresh.access_token),
        # }

        return Response({
            'message': 'Customer account created successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': f"{user.first_name} {user.last_name}".strip(),
                'phone': user.phone,
                'business_name': user.business_name or '',
                'role': user.role,
            },
            'token': token.key,                     # ← simple token auth
            # 'tokens': tokens,                     # ← use this if JWT
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    API endpoint to get the currently authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class CustomerSignupSerializer(serializers.ModelSerializer):
    """
    Serializer for customer registration (signup).
    Handles creation of new customer accounts with role='customer'.
    """
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True, max_length=15)
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password],
        help_text="Must contain at least 8 characters, including uppercase, lowercase, number and special character."
    )
    
    business_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=255,
        help_text="Optional - only relevant for business customers"
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'password',
            'business_name',
        ]
        read_only_fields = ['id']  # just in case
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )
        return value.lower()  # normalize email

    def validate_phone(self, value):
        # Very basic phone validation – you can make it stricter
        if not value.isdigit() and not value.startswith('+'):
            raise serializers.ValidationError(
                "Phone number should contain only digits or start with '+'"
            )
        return value

    def create(self, validated_data):
        # Remove password from validated_data so we can use create_user
        password = validated_data.pop('password')
        
        # Create user with customer role
        user = User.objects.create_user(
            username=validated_data['email'],           # using email as username
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            business_name=validated_data.get('business_name', ''),
            password=password,
            role='customer',                            # important – matches your logic
            is_active=True,                             # or False if you want email verification
        )
        
        return user


# ────────────────────────────────────────────────
# Serializer for reading customer profile
# ────────────────────────────────────────────────

class CustomerProfileSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for displaying customer profile information.
    Does NOT include password or sensitive write fields.
    """
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'business_name',
            'date_joined',
            'last_login',
        ]
        read_only_fields = fields

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


# ────────────────────────────────────────────────
# User Profile Serializer (alias for CustomerProfileSerializer)
# ────────────────────────────────────────────────

class UserProfileSerializer(CustomerProfileSerializer):
    """
    Alias for CustomerProfileSerializer - used for getting current user profile.
    """
    pass
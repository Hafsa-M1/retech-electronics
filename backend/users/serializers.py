# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


# ─── Customer Signup ──────────────────────────────────────────────────────────
class CustomerSignupSerializer(serializers.ModelSerializer):
    first_name    = serializers.CharField(required=True, max_length=150)
    last_name     = serializers.CharField(required=True, max_length=150)
    email         = serializers.EmailField(required=True)
    phone         = serializers.CharField(required=True, max_length=20)
    password      = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    business_name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'business_name']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.lower()

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            business_name=validated_data.get('business_name', ''),
            password=password,
            role='customer',
            is_active=True,
        )


# ─── User Profile Serializer ──────────────────────────────────────────────────
class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'business_name', 'role',
            'date_joined', 'last_login',
        ]
        read_only_fields = fields

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


# ─── Staff Create Serializer ──────────────────────────────────────────────────
class StaffCreateSerializer(serializers.ModelSerializer):
    """
    Used by admin to create staff accounts.
    Password is set by the admin and emailed via views.py — NO email sending here.
    """
    first_name = serializers.CharField(required=True, max_length=150)
    last_name  = serializers.CharField(required=True, max_length=150)
    email      = serializers.EmailField(required=True)
    phone      = serializers.CharField(required=False, allow_blank=True, max_length=20)
    password   = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password],
    )

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            password=password,
            role='staff',
            is_staff=True,
            is_active=True,
        )
# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


# -------------------- Customer Signup --------------------

class CustomerSignupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True, max_length=15)

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password],
    )

    business_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=255,
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
        read_only_fields = ['id']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )
        return value.lower()

    def validate_phone(self, value):
        if not value.isdigit() and not value.startswith('+'):
            raise serializers.ValidationError(
                "Phone number should contain only digits or start with '+'"
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User.objects.create_user(
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
        return user


# -------------------- Customer Profile --------------------

class CustomerProfileSerializer(serializers.ModelSerializer):
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


# -------------------- User Profile --------------------

class UserProfileSerializer(CustomerProfileSerializer):
    pass


# -------------------- Staff Create (ADMIN) --------------------

class StaffCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_staff = True
        user.save()
        return user
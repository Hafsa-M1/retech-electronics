from rest_framework import serializers
from .models import DeviceSubmission, SubmissionPhoto, DeviceReservation


# ─────────────────────────────────────────────
# Photo Serializer
# ─────────────────────────────────────────────

class SubmissionPhotoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SubmissionPhoto
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# ─────────────────────────────────────────────
# Customer Submission Serializer
# ─────────────────────────────────────────────

class DeviceSubmissionSerializer(serializers.ModelSerializer):
    photos = SubmissionPhotoSerializer(many=True, read_only=True)

    photo_files = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    video = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = DeviceSubmission
        fields = [
            'id',
            'brand',
            'model',
            'serial_number',
            'condition_description',

            'status',
            'submission_date',

            'photos',
            'photo_files',
            'video',
        ]
        read_only_fields = ['id', 'status', 'submission_date']

    def create(self, validated_data):
        photo_files = validated_data.pop('photo_files', [])
        video_file = validated_data.pop('video', None)

        submission = DeviceSubmission.objects.create(**validated_data)

        for photo in photo_files:
            SubmissionPhoto.objects.create(submission=submission, image=photo)

        if video_file:
            submission.video = video_file
            submission.save()

        return submission


# ─────────────────────────────────────────────
# 🔥 ADMIN + PUBLIC CATALOG SERIALIZER (FIXED)
# ─────────────────────────────────────────────

class AdminDeviceSubmissionSerializer(serializers.ModelSerializer):
    """
    Used for:
    - Admin panel
    - Public catalog
    - Device detail page
    """

    photos = SubmissionPhotoSerializer(many=True, read_only=True)

    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    customer_name = serializers.SerializerMethodField()

    video = serializers.SerializerMethodField()

    # 🔥 diagnostics (IMPORTANT FOR YOUR FIX)
    diagnostic_results = serializers.JSONField(read_only=True, allow_null=True)
    diagnostic_notes = serializers.CharField(read_only=True, allow_blank=True, allow_null=True)

    class Meta:
        model = DeviceSubmission
        fields = [
            'id',

            # device info
            'brand',
            'model',
            'serial_number',
            'condition_description',

            # status
            'status',
            'submission_date',

            # media (🔥 THIS FIXES YOUR IMAGE ISSUE)
            'photos',
            'video',

            # certification data (IMPORTANT FOR CATALOG)
            'category',
            'estimated_price',
            'final_notes',
            'certificate_id',

            # diagnostics
            'diagnostic_results',
            'diagnostic_notes',

            # customer info
            'customer_email',
            'customer_name',
        ]

    def get_customer_name(self, obj):
        u = obj.customer
        full = f"{u.first_name} {u.last_name}".strip()
        return full if full else u.email

    def get_video(self, obj):
        if not obj.video:
            return None

        request = self.context.get('request')
        return request.build_absolute_uri(obj.video.url) if request else obj.video.url


class DeviceReservationSerializer(serializers.ModelSerializer):
    device = AdminDeviceSubmissionSerializer(source='device_submission', read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = DeviceReservation
        fields = [
            'id',
            'reserved_at',
            'status',
            'customer_email',
            'customer_name',
            'device',
        ]
        read_only_fields = ['id', 'reserved_at', 'customer_email', 'customer_name', 'device']

    def get_customer_name(self, obj):
        user = obj.customer
        full = f"{user.first_name} {user.last_name}".strip()
        return full if full else user.email
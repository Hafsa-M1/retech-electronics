# submissions/serializers.py
from rest_framework import serializers
from .models import DeviceSubmission, SubmissionPhoto


class SubmissionPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionPhoto
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class DeviceSubmissionSerializer(serializers.ModelSerializer):
    photos = SubmissionPhotoSerializer(many=True, read_only=True)
    photo_files = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True, required=False, allow_empty=True
    )
    video = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = DeviceSubmission
        fields = [
            'id', 'brand', 'model', 'serial_number', 'condition_description',
            'status', 'submission_date', 'photos', 'photo_files', 'video'
        ]
        read_only_fields = ['id', 'status', 'submission_date']

    def create(self, validated_data):
        photo_files = validated_data.pop('photo_files', [])
        video_file  = validated_data.pop('video', None)
        submission  = DeviceSubmission.objects.create(**validated_data)
        for photo in photo_files:
            SubmissionPhoto.objects.create(submission=submission, image=photo)
        if video_file:
            submission.video = video_file
            submission.save()
        return submission


class AdminDeviceSubmissionSerializer(serializers.ModelSerializer):
    """Extended serializer for admin — includes customer email"""
    photos         = SubmissionPhotoSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    customer_name  = serializers.SerializerMethodField()

    class Meta:
        model = DeviceSubmission
        fields = [
            'id', 'brand', 'model', 'serial_number', 'condition_description',
            'status', 'submission_date', 'photos', 'video',
            'customer_email', 'customer_name',
        ]

    def get_customer_name(self, obj):
        u = obj.customer
        full = f"{u.first_name} {u.last_name}".strip()
        return full if full else u.username
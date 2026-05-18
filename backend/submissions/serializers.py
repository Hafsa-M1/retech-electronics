# submissions/serializers.py
from rest_framework import serializers
from .models import DeviceSubmission, SubmissionPhoto


class SubmissionPhotoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model  = SubmissionPhoto
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None


class DeviceSubmissionSerializer(serializers.ModelSerializer):
    photos      = SubmissionPhotoSerializer(many=True, read_only=True)
    photo_files = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True, required=False, allow_empty=True
    )
    video = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model  = DeviceSubmission
        fields = [
            'id', 'brand', 'model', 'serial_number', 'condition_description',
            'status', 'submission_date', 'photos', 'photo_files', 'video',
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
    """Extended serializer for admin — includes customer info and absolute media URLs."""
    photos         = SubmissionPhotoSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    customer_name  = serializers.SerializerMethodField()
    video          = serializers.SerializerMethodField()

    class Meta:
        model  = DeviceSubmission
        fields = [
            'id', 'brand', 'model', 'serial_number', 'condition_description',
            'status', 'submission_date', 'photos', 'video',
            'customer_email', 'customer_name',
        ]

    def get_customer_name(self, obj):
        u    = obj.customer
        full = f"{u.first_name} {u.last_name}".strip()
        return full if full else u.email

    def get_video(self, obj):
        if not obj.video:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.video.url)
        return obj.video.url
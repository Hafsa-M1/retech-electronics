from rest_framework import serializers
from .models import DeviceSubmission, SubmissionPhoto


class SubmissionPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionPhoto
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class DeviceSubmissionSerializer(serializers.ModelSerializer):
    photos = SubmissionPhotoSerializer(many=True, read_only=True)
    # Allow uploading multiple photos in one request
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
            'id', 'brand', 'model', 'serial_number', 'condition_description',
            'status', 'submission_date', 'photos', 'photo_files', 'video'
        ]
        read_only_fields = ['id', 'status', 'submission_date']

    def create(self, validated_data):
        # Pop files that are not model fields
        photo_files = validated_data.pop('photo_files', [])
        video_file = validated_data.pop('video', None)

        # Create the submission instance (customer is set in view)
        submission = DeviceSubmission.objects.create(**validated_data)

        # Save multiple photos
        for photo in photo_files:
            SubmissionPhoto.objects.create(submission=submission, image=photo)

        # Save video if provided
        if video_file:
            submission.video = video_file
            submission.save()

        return submission
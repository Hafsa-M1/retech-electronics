from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DeviceSubmission, SubmissionPhoto
from .serializers import DeviceSubmissionSerializer
from django.core.files.storage import default_storage


class DeviceSubmissionCreateView(APIView):
    """
    API endpoint for customers to submit a device.
    - Requires authentication (customer token)
    - Accepts multipart/form-data (text fields + photos + optional video)
    - Status defaults to 'PENDING'
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Use the serializer to validate and process data
        serializer = DeviceSubmissionSerializer(data=request.data)

        if serializer.is_valid():
            # Associate the submission with the logged-in customer
            submission = serializer.save(customer=request.user)

            # Handle uploaded photos (already processed in serializer.create)
            # Handle video (already processed in serializer.create)

            return Response(
                {
                    "message": "Device submitted successfully",
                    "submission_id": submission.id,
                    "status": submission.status
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# submissions/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model

from .models import DeviceSubmission
from .serializers import DeviceSubmissionSerializer, AdminDeviceSubmissionSerializer


# ─── Custom permission ─────────────────────────────────────────────────────────
class IsStaffOrAdmin(BasePermission):
    """Allow any authenticated user with is_staff=True (superusers included)."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


# ─── Customer views ────────────────────────────────────────────────────────────

class DeviceSubmissionCreateView(APIView):
    """POST /api/submissions/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = DeviceSubmissionSerializer(
            data=request.data,
            context={'request': request},
        )
        if serializer.is_valid():
            submission = serializer.save(customer=request.user)
            return Response(
                {
                    'message':       'Device submitted successfully',
                    'submission_id': submission.id,
                    'status':        submission.status,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyDeviceSubmissionsListView(ListAPIView):
    """GET /api/submissions/my/"""
    serializer_class   = DeviceSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeviceSubmission.objects.filter(
            customer=self.request.user
        ).order_by('-submission_date')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


# ─── Admin / Staff views ───────────────────────────────────────────────────────

class AdminSubmissionsListView(ListAPIView):
    """GET /api/submissions/admin/all/"""
    serializer_class   = AdminDeviceSubmissionSerializer
    permission_classes = [IsStaffOrAdmin]

    def get_queryset(self):
        qs = (
            DeviceSubmission.objects
            .select_related('customer')
            .prefetch_related('photos')
            .order_by('-submission_date')
        )
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class AdminSubmissionUpdateView(APIView):
    """PATCH /api/submissions/admin/<id>/update/"""
    permission_classes = [IsStaffOrAdmin]

    def patch(self, request, pk):
        try:
            submission = (
                DeviceSubmission.objects
                .select_related('customer')
                .prefetch_related('photos')
                .get(pk=pk)
            )
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status     = request.data.get('status')
        valid_statuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']

        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Choose from: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        submission.status = new_status
        submission.save()

        serializer = AdminDeviceSubmissionSerializer(
            submission, context={'request': request}
        )
        return Response({
            'message':    'Status updated successfully.',
            'submission': serializer.data,
        })


class AdminSubmissionStatsView(APIView):
    """GET /api/submissions/admin/stats/"""
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        User = get_user_model()
        qs   = DeviceSubmission.objects.all()
        return Response({
            'total_submissions': qs.count(),
            'pending':           qs.filter(status='PENDING').count(),
            'under_review':      qs.filter(status='UNDER_REVIEW').count(),
            'approved':          qs.filter(status='APPROVED').count(),
            'rejected':          qs.filter(status='REJECTED').count(),
            'staff_count':       User.objects.filter(is_staff=True).count(),
        })
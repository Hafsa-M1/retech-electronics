from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
import uuid
from django.db.models import Count

from .models import DeviceSubmission, DeviceReservation
from .serializers import DeviceSubmissionSerializer, AdminDeviceSubmissionSerializer, DeviceReservationSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
from rest_framework.pagination import PageNumberPagination

class SubmissionsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
# ─────────────────────────────────────────────
# Permission
# ─────────────────────────────────────────────

class IsStaffOrAdmin(BasePermission):
    """Allow any authenticated staff/admin user."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )


# ─────────────────────────────────────────────
# Customer Views
# ─────────────────────────────────────────────

class DeviceSubmissionCreateView(APIView):
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
                    'message': 'Device submitted successfully',
                    'submission_id': submission.id,
                    'status': submission.status,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyDeviceSubmissionsListView(ListAPIView):
    serializer_class = DeviceSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeviceSubmission.objects.filter(
            customer=self.request.user
        ).order_by('-submission_date')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


# ─────────────────────────────────────────────
# Reservation Views

class DeviceReservationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            submission = DeviceSubmission.objects.select_related('customer').get(
                pk=pk,
                status='PUBLISHED',
            )
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Device not available for reservation.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if hasattr(submission, 'reservation'):
            return Response(
                {'error': 'This device has already been reserved.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reservation = DeviceReservation.objects.create(
            device_submission=submission,
            customer=request.user,
        )

        serializer = DeviceReservationSerializer(
            reservation,
            context={'request': request},
        )

        return Response({
            'message': 'Device reserved successfully.',
            'reservation': serializer.data,
        }, status=status.HTTP_201_CREATED)


class StaffReservationsListView(ListAPIView):
    serializer_class = DeviceReservationSerializer
    permission_classes = [IsStaffOrAdmin]

    def get_queryset(self):
        return DeviceReservation.objects.select_related(
            'customer',
            'device_submission',
            'device_submission__customer',
        ).prefetch_related('device_submission__photos').order_by('-reserved_at')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class ReservationUpdateStatusView(APIView):
    permission_classes = [IsStaffOrAdmin]

    def patch(self, request, pk):
        try:
            reservation = DeviceReservation.objects.get(pk=pk)
        except DeviceReservation.DoesNotExist:
            return Response(
                {'error': 'Reservation not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get('status')
        valid_statuses = ['ACTIVE', 'COMPLETED']

        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Choose from: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reservation.status = new_status
        reservation.save()

        serializer = DeviceReservationSerializer(
            reservation,
            context={'request': request}
        )

        return Response({
            'message': f'Reservation marked as {new_status.lower()}.',
            'reservation': serializer.data,
        }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# Admin Views
# ─────────────────────────────────────────────

class AdminSubmissionsListView(ListAPIView):
    serializer_class = AdminDeviceSubmissionSerializer
    permission_classes = [IsStaffOrAdmin]
    pagination_class   = SubmissionsPagination

    def get_queryset(self):
        qs = DeviceSubmission.objects.select_related(
            'customer'
        ).prefetch_related('photos').order_by('-submission_date')

        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter.upper())

        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class AdminSubmissionUpdateView(APIView):
    permission_classes = [IsStaffOrAdmin]

    def patch(self, request, pk):
        try:
            submission = DeviceSubmission.objects.select_related(
                'customer'
            ).prefetch_related('photos').get(pk=pk)
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get('status')
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
            'message': 'Status updated successfully.',
            'submission': serializer.data,
        })


# ─────────────────────────────────────────────
# FIXED: Diagnostics View (IMPORTANT)
# ─────────────────────────────────────────────

class DeviceDiagnosticsView(APIView):
    permission_classes = [IsStaffOrAdmin]

    def post(self, request, pk):
        try:
            submission = DeviceSubmission.objects.get(pk=pk)
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        action = request.data.get('action')
        notes = request.data.get('notes', '')
        results = request.data.get('results', {})

        # DEBUG LOGS
        print("=" * 50)
        print("DIAGNOSTICS REQUEST RECEIVED")
        print("ACTION:", action)
        print("RESULTS:", results)
        print("NOTES:", notes)
        print("FULL REQUEST DATA:", request.data)
        print("=" * 50)

        valid_actions = ['CERTIFIED', 'REFURBISH', 'REJECTED']

        if action not in valid_actions:
            return Response(
                {'error': f'Invalid action. Use one of: {valid_actions}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save diagnostics
        submission.diagnostic_results = results
        submission.diagnostic_notes = notes
        submission.status = action

        if action == 'CERTIFIED':
            submission.certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"

        submission.save()

        # VERIFY WHAT WAS SAVED
        submission.refresh_from_db()

        print("SAVED diagnostic_results:", submission.diagnostic_results)
        print("SAVED diagnostic_notes:", submission.diagnostic_notes)
        print("SAVED status:", submission.status)
        print("=" * 50)

        serializer = AdminDeviceSubmissionSerializer(
            submission,
            context={'request': request}
        )

        return Response({
            'message': f'Device successfully processed as {action}',
            'submission': serializer.data,
            'certificate_id': submission.certificate_id if action == 'CERTIFIED' else None,
        }, status=status.HTTP_200_OK)

# ─────────────────────────────────────────────
# Certification View
# ─────────────────────────────────────────────

class DeviceCertificationView(APIView):
    permission_classes = [IsStaffOrAdmin]

    def post(self, request, pk):
        try:
            submission = DeviceSubmission.objects.get(pk=pk)
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Submission not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if submission.status != 'CERTIFIED':
            return Response({
                'error': 'Only CERTIFIED devices can be processed in certification stage.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not submission.diagnostic_results:
            return Response({
                'error': 'Device diagnostics must be recorded before publishing to the catalog.'
            }, status=status.HTTP_400_BAD_REQUEST)

        submission.category = request.data.get('category')
        submission.estimated_price = request.data.get('estimated_price')
        submission.final_notes = request.data.get('final_notes', '')
        submission.status = 'PUBLISHED'
        submission.save()

        serializer = AdminDeviceSubmissionSerializer(
            submission,
            context={'request': request}
        )

        return Response({
            'message': 'Device successfully published to the catalog.',
            'submission': serializer.data,
            'certificate_id': submission.certificate_id,
        })


# ─────────────────────────────────────────────
# Stats
# ─────────────────────────────────────────────

class AdminSubmissionStatsView(APIView):
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        User = get_user_model()
        qs = DeviceSubmission.objects.all()

        return Response({
            # User Statistics
            'total_customers': User.objects.filter(role='customer').count(),
            'total_staff': User.objects.filter(role='staff').count(),
            
            # Submission Statistics
            'total_submissions': qs.count(),
            'pending': qs.filter(status='PENDING').count(),
            'under_review': qs.filter(status='UNDER_REVIEW').count(),
            'approved': qs.filter(status='APPROVED').count(),
            
            # Device Status Statistics
            'diagnostics_completed': qs.filter(status__in=['CERTIFIED', 'REFURBISH', 'REJECTED']).count(),
            'certified': qs.filter(status='CERTIFIED').count(),
            'refurbishment': qs.filter(status='REFURBISH').count(),
            'rejected': qs.filter(status='REJECTED').count(),
            'published_for_sale': qs.filter(status='PUBLISHED').count(),
            'sold': qs.filter(status='SOLD').count(),
        })


# ─────────────────────────────────────────────
# Public Catalog
# ─────────────────────────────────────────────

class PublicPublishedDeviceDetailView(APIView):
    permission_classes = []

    def get(self, request, pk):
        try:
            submission = DeviceSubmission.objects.select_related('customer').prefetch_related('photos').get(
                pk=pk,
                status='PUBLISHED',
                reservation__isnull=True,
            )
        except DeviceSubmission.DoesNotExist:
            return Response(
                {'error': 'Device not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminDeviceSubmissionSerializer(
            submission,
            context={'request': request}
        )
        return Response(serializer.data)


class PublicPublishedDevicesView(ListAPIView):
    serializer_class = AdminDeviceSubmissionSerializer
    permission_classes = []

    def get_queryset(self):
        return DeviceSubmission.objects.filter(
            status='PUBLISHED',
            reservation__isnull=True,
        ).select_related('customer').prefetch_related('photos').order_by('-submission_date')


class ReservationCompleteView(APIView):
    """POST /api/submissions/admin/reservations/<int:pk>/complete/"""
    permission_classes = [IsStaffOrAdmin]

    def post(self, request, pk):
        try:
            reservation = DeviceReservation.objects.get(pk=pk)
        except DeviceReservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)

        # Mark reservation as completed
        reservation.status = 'COMPLETED'
        reservation.save()

        # Optionally mark the device as sold
        device = reservation.device_submission
        device.status = 'SOLD'
        device.save()

        return Response({
            'message': 'Reservation marked as sold successfully.',
            'reservation_id': reservation.id,
            'device_id': device.id,
            'status': 'COMPLETED'
        }, status=status.HTTP_200_OK)

# ─────────────────────────────────────────────
# Popular Categories for Homepage
# ─────────────────────────────────────────────

class PopularCategoriesView(APIView):
    permission_classes = [AllowAny]   # Anyone can see this

    def get(self, request):
        # Get top categories from published devices
        categories = DeviceSubmission.objects.filter(
            status='PUBLISHED'
        ).values('category').annotate(
            count=Count('id')
        ).order_by('-count')[:6]

        data = []
        category_icons = {
            "Smartphone": "📱",
            "Laptop": "💻",
            "Tablet": "📟",
            "Smartwatch": "⌚",
            "Headphones": "🎧",
            "Camera": "📷",
            "Desktop": "🖥️",
            "Other": "📦"
        }

        for cat in categories:
            name = cat['category'] or "Other"
            data.append({
                "icon": category_icons.get(name, "📦"),
                "name": name,
                "count": f"{cat['count']}+",
                "label": "devices available",
                "color": self.get_category_color(name)
            })

        # If no data yet, return some default categories
        if not data:
            data = [
                {"icon": "📱", "name": "Smartphone", "count": "250+", "label": "devices available", "color": "bg-gradient-to-r from-green-500 to-emerald-600"},
                {"icon": "💻", "name": "Laptop", "count": "180+", "label": "devices available", "color": "bg-gradient-to-r from-blue-500 to-cyan-600"},
                {"icon": "📟", "name": "Tablet", "count": "95+", "label": "devices available", "color": "bg-gradient-to-r from-purple-500 to-violet-600"},
            ]

        return Response(data)

    def get_category_color(self, name):
        colors = {
            "Smartphone": "bg-gradient-to-r from-green-500 to-emerald-600",
            "Laptop": "bg-gradient-to-r from-blue-500 to-cyan-600",
            "Tablet": "bg-gradient-to-r from-purple-500 to-violet-600",
            "Smartwatch": "bg-gradient-to-r from-amber-500 to-orange-600",
        }
        return colors.get(name, "bg-gradient-to-r from-gray-500 to-slate-600")
# submissions/urls.py

from django.urls import path
from .views import (
    DeviceSubmissionCreateView,
    MyDeviceSubmissionsListView,
    AdminSubmissionsListView,
    AdminSubmissionUpdateView,
    AdminSubmissionStatsView,
    DeviceDiagnosticsView,
    DeviceCertificationView,
    DeviceReservationCreateView,
    StaffReservationsListView,
    ReservationCompleteView,               
    PublicPublishedDeviceDetailView,
    PublicPublishedDevicesView,
    PopularCategoriesView,
)

urlpatterns = [
    # -------------------- Customer Routes --------------------
    path(
        '',
        DeviceSubmissionCreateView.as_view(),
        name='device-submission-create'
    ),
    path(
        'my/',
        MyDeviceSubmissionsListView.as_view(),
        name='my-submissions-list'
    ),

    # -------------------- Admin / Staff Routes --------------------
    path(
        'admin/all/',
        AdminSubmissionsListView.as_view(),
        name='admin-submissions-list'
    ),
    path(
        'admin/stats/',
        AdminSubmissionStatsView.as_view(),
        name='admin-submissions-stats'
    ),
    path(
        'admin/<int:pk>/update/',
        AdminSubmissionUpdateView.as_view(),
        name='admin-submission-update'
    ),

    # -------------------- Diagnostics & Certification Routes --------------------
    path(
        '<int:pk>/diagnostics/',
        DeviceDiagnosticsView.as_view(),
        name='device-diagnostics'
    ),
    path(
        '<int:pk>/certify/',
        DeviceCertificationView.as_view(),
        name='device-certification'
    ),

    # -------------------- Reservations --------------------
    path('public/catalog/<int:pk>/reserve/', DeviceReservationCreateView.as_view(), name='public-device-reserve'),
    path('admin/reservations/', StaffReservationsListView.as_view(), name='admin-reservations-list'),
    path('admin/reservations/<int:pk>/complete/', ReservationCompleteView.as_view(), name='reservation-complete'),

    # -------------------- Public Catalog --------------------
    path('public/catalog/<int:pk>/', PublicPublishedDeviceDetailView.as_view(), name='public-catalog-detail'),
    path('public/catalog/', PublicPublishedDevicesView.as_view(), name='public-catalog'),

    # Popular Categories for Homepage
    path('popular-categories/', PopularCategoriesView.as_view(), name='popular-categories'),
]
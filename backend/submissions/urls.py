# submissions/urls.py

from django.urls import path
from .views import (
    DeviceSubmissionCreateView,
    MyDeviceSubmissionsListView,
    AdminSubmissionsListView,
    AdminSubmissionUpdateView,
    AdminSubmissionStatsView,
)

urlpatterns = [
    # -------------------- Customer --------------------
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

    # -------------------- Admin --------------------
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
]
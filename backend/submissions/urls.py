# submissions/urls.py
from django.urls import path
from .views import (
    DeviceSubmissionCreateView,
    MyDeviceSubmissionsListView,
)

urlpatterns = [
    path('submissions/', DeviceSubmissionCreateView.as_view(), name='device-submission-create'),
    path('my/', MyDeviceSubmissionsListView.as_view(), name='my-submissions-list'),
]
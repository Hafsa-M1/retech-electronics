from django.urls import path
from .views import DeviceSubmissionCreateView

urlpatterns = [
    path('submissions/', DeviceSubmissionCreateView.as_view(), name='device-submission-create'),
]
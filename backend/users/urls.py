# users/urls.py
from django.urls import path
from .views import (
    CustomerSignupView,
    CurrentUserView,
    AdminLoginView,
    AdminStaffListView,
    AdminStaffCreateView,
)

urlpatterns = [
    path('signup/', CustomerSignupView.as_view(), name='customer-signup'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/staff/', AdminStaffListView.as_view(), name='admin-staff-list'),
    path('admin/staff/create/', AdminStaffCreateView.as_view(), name='admin-staff-create'),
]
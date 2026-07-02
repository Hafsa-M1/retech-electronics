# users/urls.py
from django.urls import path
from .views import (
    CustomerSignupView,
    CurrentUserView,
    AdminLoginView,
    AdminStaffListView,
    AdminStaffCreateView,
    AdminStaffToggleActiveView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

urlpatterns = [
    # ── Customer ──────────────────────────────────────────────────────────────
    path('signup/', CustomerSignupView.as_view(), name='customer-signup'),
    path('me/',     CurrentUserView.as_view(),    name='current-user'),

    # ── Admin auth ────────────────────────────────────────────────────────────
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),

    # ── Staff management ──────────────────────────────────────────────────────
    path('admin/staff/',                 AdminStaffListView.as_view(),         name='admin-staff-list'),
    path('admin/staff/create/',          AdminStaffCreateView.as_view(),       name='admin-staff-create'),
    path('admin/staff/<int:pk>/toggle/', AdminStaffToggleActiveView.as_view(), name='admin-staff-toggle'),

    # ── Password reset ────────────────────────────────────────────────────────
    path('password-reset/',         PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
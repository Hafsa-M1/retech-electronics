# users/urls.py
from django.urls import path
from .views import CustomerSignupView

urlpatterns = [
    path('signup/', CustomerSignupView.as_view(), name='customer-signup'),
]
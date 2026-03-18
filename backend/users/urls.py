# users/urls.py
from django.urls import path
from .views import CustomerSignupView, CurrentUserView

urlpatterns = [
    path('signup/', CustomerSignupView.as_view(), name='customer-signup'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
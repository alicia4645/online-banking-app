from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignupView, SigninView, LoggedInStatusView, AccountView, TransactionView

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view()),
    path('signin/', SigninView.as_view()),
    path('loggedin/status/', LoggedInStatusView.as_view() ),
    path('account/', AccountView.as_view()),
    path('transactions/', TransactionView.as_view())
]

from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from bankingApp.serializers import MongoTokenObtainView
from .views import SignupView, SigninView, LoggedInStatusView

urlpatterns = [
    path('token/', MongoTokenObtainView.as_view(), name='token_obtain_mongo'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view()),
    path('signin/', SigninView.as_view()),
    path('loggedin/status/', LoggedInStatusView.as_view() )
]

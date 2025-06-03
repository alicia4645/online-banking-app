from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from bankingApp.authentication import MongoTokenObtainView
from .views import SignupView

urlpatterns = [
    path('token/', MongoTokenObtainView.as_view(), name='token_obtain_mongo'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view()),
]

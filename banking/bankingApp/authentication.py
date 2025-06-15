from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed

from bankingApp.models import User

def enforce_csrf(request):
    check = CSRFCheck()
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class  CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        #enforce_csrf(request)
        
        return get_user(self,validated_token), validated_token
    
def get_user(self, validated_token):
        user_id_claim = settings.SIMPLE_JWT.get("USER_ID_CLAIM", "user_id")
        try:
            user_id = validated_token[user_id_claim] 
        except KeyError:
            raise InvalidToken("Token contained no recognizable user identification")

        try:
            user = User.objects(pk=user_id).first()
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found", code="user_not_found")

        return user
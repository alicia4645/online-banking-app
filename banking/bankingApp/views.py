from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.middleware import csrf

class SignupView(APIView):
    permission_classes = []
    def post(self, request):
     
        data = request.data
        print(data)
        username = data['user']['username']
        email = data['user']['email']
        password = data['user']['password']
        firstname = data['user']['firstname']
        lastname = data['user']['lastname']
    
        if not all([username, email, password, firstname, lastname]):
            return Response({'error': 'All fields are required'}, status=400)
    
        #username must be unique
        if User.objects(username=username).first():
            return Response({"error":"Username already in use"}, status=400)

        #emails must be unique
        if User.objects(email=email).first():
            return Response({'error': "Email already in use"}, status=400)
        
        #create user object and save to mongodb
        user = User(username=username, email=email, firstname=firstname, lastname=lastname)
        user.set_password(password)
        user.save()

        return Response({'message': 'User signed up successfully'}, status=201)


class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        response = Response({"message" : "Login successfully"})
        username = data["username"]
        password = data["password"]
        user = User.objects(username=username).first()
      
        if user is not None and user.check_password(password):
            refresh = RefreshToken.for_user(user)
                
            data ={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value = data["access"],
                httponly= settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure= settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite= settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path= '/',
                max_age=900,
            )

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
                value = data["refresh"],
                httponly= settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure= settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite= settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                path= '/',
                max_age=7 * 24 * 3600,
            )

            csrf.get_token(request)
            print(f"response {response.cookies}")
            return response
        else:
            return Response({"error" : "Invalid username or password!"}, status=400)
        
class LoggedInStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"authenticated": True})
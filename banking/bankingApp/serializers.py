# Custom serializer to handle MongoDB login
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from bankingApp.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class MongoTokenObtainSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = User.objects(username=username).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid username or password")

        # Monkey-patch required fields for JWT
        user.id = str(user.id)
        user.pk = user.id

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


# Custom view to return tokens
class MongoTokenObtainView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = MongoTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    



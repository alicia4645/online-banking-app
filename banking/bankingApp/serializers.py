from rest_framework_mongoengine import serializers
from .models import Account
from .models import User

class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        exclude = ["password"]


class AccountSerializer(serializers.DocumentSerializer):
    user = UserSerializer()

    class Meta: 
        model = Account
        fields = "__all__"


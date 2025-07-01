from rest_framework_mongoengine import serializers
from .models import Account, Transaction, Card
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

class TransactionSerializer(serializers.DocumentSerializer):
    user = AccountSerializer()
    account = AccountSerializer()

    class Meta:
        model = Transaction
        fields = "__all__"

class CardSerializer(serializers.DocumentSerializer):
    user = UserSerializer()
    account = AccountSerializer()

    class Meta:
        model = Card
        fields = "__all__"
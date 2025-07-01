from .models import User, Account, Transaction, Card
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.middleware import csrf
import random
from .serializers import AccountSerializer, TransactionSerializer, CardSerializer
import decimal
from datetime import date, timedelta

class SignupView(APIView):
    permission_classes = []
    def post(self, request):
     
        data = request.data
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

    def post(self, request):
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

            #creact account on initial login if one does not already exist 
            if not Account.objects.filter(user=user, account_type=Account.CURRENT):
                account_number = random.randint(10000000, 99999999)  
                Account.objects.create(
                    user=user, 
                    account_type=Account.CURRENT, 
                    balance=100, 
                    account_number=account_number, 
                    sort_code=250910
                )

            if not Card.objects.filter(user=user):
                card = Card(
                    user=user,
                    account= Account.objects.filter(user=user, account_type=Account.CURRENT).first(),
                    cvv= f"{random.randint(0,999):03d}",
                    pin= f"{random.randint(0,9999):04d}",
                    expiry_date = date.today().replace(year=date.today().year + 4)
                )
                card.create_card_number()
                card.save()
            
    
            
            return response
        else:
            return Response({"error" : "Invalid username or password!"}, status=400)
        
class LoggedInStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"authenticated": True})
    
def create_card(user, account):
    card = Card(
        user=user,
        account= account,
        cvv= f"{random.randint(0,999):03d}",
        pin= f"{random.randint(0,9999):04d}",
        expiry_date = date.today().replace(year=date.today().year + 4)
    )
    card.create_card_number()
    card.save()

class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        accounts = Account.objects(user=user)
        serializer = AccountSerializer(accounts, many=True)
        return Response({"message":serializer.data})
    
    def post(self, request):
        user = request.user
        acc_type = request.data["account_type"]
        account_number = random.randint(10000000, 99999999)  
        account = Account(
            user=user, 
            account_type=acc_type, 
            balance=100, 
            account_number=account_number, 
            sort_code=250910
        ) 
        account.save()
        create_card(user, account )
        return Response({"message": f"Your {acc_type} Account has successfully been created"})


    
class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        amount = data["amount"]

        #get sender account details and update
        sender_account_number = data["sender"]["account_number"]
        sender_account = Account.objects( account_number=sender_account_number).first()
        sender_account.balance -= decimal.Decimal(amount)
        sender_account.save()

        #get reciever acount details and update
        receiver_account_number = data["receiver"]["account_number"]
        receiver_account = Account.objects(account_number=receiver_account_number).first()
        receiver_account.balance += decimal.Decimal(amount)
        receiver_account.save()

        #sender transaction
        Transaction(user=sender_account , account=receiver_account, action=Transaction.SENDING, amount=amount, new_balance=sender_account.balance).save()
        #receiver transaction
        Transaction(user=receiver_account, account=sender_account, action=Transaction.RECEIVING, amount=amount, new_balance=receiver_account.balance).save()

       
        return Response({"message":"Transfer successful"})
    
    def get(self, request):
        user = request.user
        user_account = Account.objects(user=user).first()
        user_transactions = Transaction.objects.filter(user=user_account)
        serializer = TransactionSerializer(user_transactions, many=True)

        return Response({"message":serializer.data})
    

#cardview get cards
class CardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cards = Card.objects.filter(user=user)
        serializer = CardSerializer(cards, many=True)

        return Response({"message":serializer.data})
    
    def post(self, request):
        user = request.user
        acc_type = request.data["type"]
        account = Account.objects.filter(user=user, account_type=acc_type).first()
        
        create_card(user,account)

        return Response({"message": "Card successfully made"})
    


from django.shortcuts import render
import json
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class SignupView(APIView):
    permission_classes = []
    def post(self, request):
     
        data = request.data
        username = data['username']
        email = data['email']
        password = data['password']
        firstname = data['firstname']
        lastname = data['lastname']
    
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




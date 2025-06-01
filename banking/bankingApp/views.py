from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['username']
            email = data['email']
            password = data['password']
            firstname = data['firstname']
            lastname = data['lastname']
        except (KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Invalid input'}, status=400)
        
        #username must be unique
        if User.object(username=username).first():
            return JsonResponse({"error":"Username already in use"}, status=400)

        #emails must be unique
        if User.objects(email=email).first():
            return JsonResponse({'error': "Email already in use"}, status=400)
        
        #create user object and save to mongodb
        user = User(username=username, email=email, firstname=firstname, lastname=lastname)
        user.set_password(password)
        user.save()

        return JsonResponse({'message': 'User signed up successfully'}, status=201)
    return JsonResponse({'error':'only POST method allowed'}, status=405)

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
        except:
            return JsonResponse({'error': 'Invalid input'}, status=400)

        #check username exists and password is correct
        user = User.objects(username=username).first()
        
        if not user or not user.check_password(password):
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        
        return JsonResponse({'message': 'User signed in successfully'}, status=201)

    return JsonResponse({'error':'only POST method allowed'}, status=405)

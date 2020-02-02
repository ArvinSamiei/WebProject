from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json

@api_view(['POST'])
@csrf_exempt
def login(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    print(username, password)
    if User.objects.filter(username=username).filter(password=password).exists():
        return Response({'message': 'Login Successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Login Failed'}, status=status.HTTP_401_UNAUTHORIZED)


def signup(request):
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    user = User(username=username, password=password, email=email)
    try:
        user.save()
    except IntegrityError as e:
        if 'unique constraint' in e.message:
            return Response('You Have Already SignedUp', status=status.HTTP_400_BAD_REQUEST)
    return Response('SignUp Succesful', status=status.HTTP_200_OK)

from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse


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


@api_view(['POST'])
def signup(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    name = body['name']
    lastname = body['lastname']
    username = body['username']
    password = body['password']
    email = body['email']
    user = User(first_name=name, last_name=lastname,
                username=username, password=password, email=email)
    try:
        user.save()
    except IntegrityError as e:
        if 'unique constraint' in e.message:
            return Response('You Have Already SignedUp', status=status.HTTP_400_BAD_REQUEST)
    return Response('SignUp Succesful', status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([MultiPartParser])
@csrf_exempt
def uploadImage(request):
    image = request.data['image']
    username = request.data['username']
    user = User.objects.get(username=username)
    user.image = image
    user.save()
    return Response('', status=status.HTTP_200_OK)

def download_image(request, username):
    user = User.objects.get(username=username)
    image_name = str(user.image)
    print(image_name)
    with open(image_name, "rb") as f:
        return HttpResponse(f.read(), content_type="image/jpeg")

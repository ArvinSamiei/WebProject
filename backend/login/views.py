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
from django.http import Http404
from django.utils import timezone
from django.core import serializers
from django.db.models import Q
from datetime import timedelta
import datetime


@api_view(['POST'])
@csrf_exempt
def login(request):
    print(request.headers)
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    print(username, password)
    queryset = User.objects.filter(username=username).filter(password=password)
    if queryset.exists():
        user = queryset[0]
        user.last_login = timezone.now()
        user.save()
        return Response({'message': 'Login Successful', 'id': user.id}, status=status.HTTP_200_OK, headers={
            'Set-Cookie': 'id=' + str(user.id)+'; Path=/; Expires='+datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(days=7), "%a, %d-%b-%Y %H:%M:%S GMT")+'; Domain=127.0.0.1',
            'Access-Control-Expose-Headers': '*',
            'Access-Control-Allow-Credentials': True
        })
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
    return Response('SignUp Succesful', status=status.HTTP_200_OK, headers={
        'Set-Cookie': 'id=' + str(user.id)+'; Expires='+datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(days=7), "%a, %d-%b-%Y %H:%M:%S GMT")+'; Domain=127.0.0.1',
        'Access-Control-Expose-Headers': '*'
    })


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
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        with open('images/default-user-icon-profile.png', "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")

def download_image2(request, user_id):
    user = User.objects.get(pk=user_id)
    image_name = str(user.image)
    print(image_name)
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        with open('images/default-user-icon-profile.png', "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")

def send_profile(request, username):
    print(request.headers)
    user = User.objects.filter(username=username)
    product = serializers.serialize(
        'json', user, fields=('username', 'first_name', 'last_name', 'email', 'image', 'last_login', 'followingUsers', 'followingChannels'))
    return HttpResponse(product, )

def fetch_user(request, user_id):
    print(request.headers)
    user = User.objects.filter(pk=user_id)
    product = serializers.serialize(
        'json', user, fields=('username', 'first_name', 'last_name', 'email', 'image', 'last_login', 'followingUsers', 'followingChannels'))
    return HttpResponse(product, content_type='application/json')

@api_view(['POST'])
@parser_classes([MultiPartParser])
@csrf_exempt
def createPost(request):
    image = request.data['image']
    title = request.data['title']
    text = request.data['text']
    id = request.data['id']
    typ = request.data['type']
    post = Post(creater_type=typ, creator_id=id, title=title, text=text, image=image)
    post.save()
    return Response('', status=status.HTTP_200_OK)
# @api_view(['GET'])

def fetch_posts_following(id):
    posts = list(Post.objects.all())
    user = User.objects.get(pk=id)
    followingUserse = UserRelation.objects.filter(follower=user).all()
    followingUsers = []
    for i in followingUserse:
        followingUsers.append(i.followed)
    print(followingUsers)
    fetched_posts = []
    for post in posts:
        if post.creater_type == 0:
            for followingUser in followingUsers:
                if post.creator_id == followingUser.id:
                    fetched_posts.append(post)
        else:
            for followingChannel in user.channels_set:
                if post.creator_id == followingChannel.id:
                    fetched_posts.append(post)
    return fetched_posts

def fetch_posts_newests():
    return Post.objects.all().order_by('-create_date')[:50]

def fetch_posts_breakings():
    print(timezone.now().date() - timedelta(days=7))
    print(Post.objects.get(pk=1).create_date)
    return Post.objects.filter(create_date__gte=timezone.now() - timedelta(days=7)).order_by('-likes')[:20]

def fetch_posts_participating(id):
    first = list(Post.objects.filter(creater_type=0).filter(creator_id=id))
    second = []
    posts = list(Post.objects.all())
    for post in posts:
        for comment in post.comments.all():
            if comment.creator.id == id:
                second.append(post)
    return [*first, *second]

def fetchAllPosts(request):
    id = request.GET.get('id')
    name = request.GET.get('name')
    fetched_posts = []
    if name=="Following":
        fetched_posts = fetch_posts_following(id)
    elif name=="Newests":
        fetched_posts = fetch_posts_newests()
    elif name== "Breakings":
        fetched_posts = fetch_posts_breakings()
    elif name=="Participatings":
        fetched_posts = fetch_posts_participating(id)
    print(id)
    
    print(fetched_posts)
    postse = serializers.serialize(
        'json', fetched_posts)
    return HttpResponse(postse)
@api_view(['GET',])
def download_image_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    image_name = str(post.image)
    print(image_name)
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        return Response('', status=status.HTTP_404_NOT_FOUND)

def others_profile(request, id):
    user = User.objects.filter(pk=id)[0]
    myId = request.GET.get('myId')
    me = User.objects.filter(pk=myId)[0]
    data = None
    if UserRelation.objects.filter(follower=me).filter(followed=user).exists():
        data = {'following': True}
    else:
        data={'following': False}
    data = json.dumps(data)
    return HttpResponse(data)
@api_view(['POST'])
@csrf_exempt
def follow(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    myId = body['myId']
    hisId = body['hisId']
    followe = body['follow']
    print(followe)
    hisId = int(hisId)
    user = User.objects.filter(pk=hisId)[0]
    me = User.objects.filter(pk=myId)[0]
    if user == me:
        return Response('An Error Occured', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if followe:
        userRelation = UserRelation(follower=me, followed=user)
        userRelation.save()
        return HttpResponse('You Followed '+user.full_name)
    else:
        userRelation = UserRelation.objects.filter(follower=me).filter(followed=user)
        userRelation.delete()
        return HttpResponse('You Unfollowed '+user.full_name)
@api_view(['POST'])
@csrf_exempt
def changePassword(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    id = body['id']
    newPassword = body['newPassword']
    oldPassword = body['oldPassword']
    user = User.objects.get(pk=id)
    if user.password == oldPassword:
        user.password = newPassword
        user.save()
        return Response('Your Password Changed Successfully')
    else:
        return Response('Password Incorrect', status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@parser_classes([MultiPartParser])
@csrf_exempt
def changeAccount(request):
    image = request.data['image']
    id = request.data['id']
    name = request.data['name']
    lastname = request.data['lastname']
    email = request.data['email']
    user = User.objects.get(pk=id)
    if name != '':
        user.first_name = name
    if lastname != '':
        user.last_name = lastname
    if email != '':
        user.email = email
    if image != 'undefined':
        user.image = image
    user.save()
    return Response('Account Successfully Changed!')
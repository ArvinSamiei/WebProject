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
import json
from django.http import JsonResponse


@api_view(['POST'])
@csrf_exempt
def login(request):
    # print(request.headers)
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']
    # print(username, password)
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
@csrf_exempt
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
    # print(image_name)
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        with open('images/default-user-icon-profile.png', "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")

def download_image2(request, user_id):
    # print(user_id, 'oooooooooooooooooooaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    user = User.objects.get(pk=user_id)
    image_name = str(user.image)
    # print(image_name)
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        with open('images/default-user-icon-profile.png', "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")

def send_profile(request, username):
    # print(request.headers)
    user = User.objects.filter(username=username)
    product = serializers.serialize(
        'json', user, fields=('username', 'first_name', 'last_name', 'email', 'image', 'last_login', 'followingUsers', 'followingChannels'))
    return HttpResponse(product, )

def fetch_user(request, user_id):
    # print(request.headers)
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
    # print(followingUsers)
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
from django.db. models import F 
def fetch_posts_breakings():
    # print(timezone.now().date() - timedelta(days=7))
    # print(Post.objects.get(pk=1).create_date)
    return Post.objects.filter(create_date__gte=timezone.now() - timedelta(days=7)).annotate(point=F('likes')-F('dislikes')).order_by('-point')[:20]

def fetch_posts_participating(id):
    first = list(Post.objects.filter(creater_type=0).filter(creator_id=id))
    second = []
    posts = list(Post.objects.all())
    for post in posts:
        for comment in post.comments.all():
            if comment.creator.id == id:
                second.append(post)
    return [*first, *second]

@api_view(["GET"])
@csrf_exempt
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
    # print(id)
    
    # print(fetched_posts)
    postse = serializers.serialize(
        'json', fetched_posts)
    return HttpResponse(postse)
@api_view(['GET',])
def download_image_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    image_name = str(post.image)
    # print(image_name)
    try:
        with open(image_name, "rb") as f:
            return HttpResponse(f.read(), content_type="image/jpeg")
    except IOError as e:
        return Response('', status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@csrf_exempt
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
    # print(followe)
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
        return Response({ 'message': 'Password Incorrect' }, status=status.HTTP_400_BAD_REQUEST)

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

def f(data):
    c = Comment.objects.get(pk=data['0'])
    # print(c.__dict__, 'oooooooooooooooooooo')
    for reply in c.replies.all():
        print(c.id, 'ppppppppppppppppppppppppppppppppppppppppp')
        data['1'].append({'0': reply.id, '1': []})
    for i in range(len(data['1'])):
        f(data['1'][i])


def fetch_post_detail(request):
    data = dict()
    post_id = request.GET.get('id')
    print(post_id, 'lllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')

    post = Post.objects.get(pk=post_id)
    data['0'] = post.id
    data['1'] = []
    for comment in post.comments.all():
        data['1'].append({'0': comment.id, '1': []})
    for i in range(len(post.comments.all())):
        f(data['1'][i])
    # print(data, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
    data = json.dumps(data)
    # data = serializers.serialize('json', data)
    return HttpResponse(data)
        
def fetch_post(request, post_id):
    post = Post.objects.filter(pk=post_id)
    data = serializers.serialize('json', post)
    return HttpResponse(data)

def fetch_comment(request, comment_id):
    comment = Comment.objects.filter(pk=comment_id)
    data = serializers.serialize('json', comment)
    return HttpResponse(data)

def send_profile_by_id(request, user_id):
    user = User.objects.filter(pk=user_id)
    print(user)
    data = serializers.serialize('json', user)
    return HttpResponse(data)

@api_view(['POST'])
@csrf_exempt
def add_comment(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    fromPost = body['fromPost']
    parentId = body['parentId']
    myId = body['myId']
    text = body['text']
    print(text, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    print(fromPost, parentId, myId, text)
    user = User.objects.get(pk=myId)
    if fromPost:
        post = Post.objects.get(pk=parentId)

        comment = Comment(creator=user, text=text)
        comment.save()
        post.comments.add(comment)
        post.save()
    else:
        comment = Comment.objects.get(pk=parentId)
        newComment = Comment(creator=user, text=text)
        newComment.save()
        print(newComment, '.............................................................')
        comment.replies.add(newComment)
        comment.save()
    return Response('Added')
@api_view(['POST'])
@csrf_exempt
def like(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    postId = body['postId']
    post = Post.objects.get(pk=postId)
    post.likes += 1
    post.save()
    return HttpResponse('done')

@api_view(['POST'])
@csrf_exempt
def dislike(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    postId = body['postId']
    post = Post.objects.get(pk=postId)
    post.dislikes += 1
    post.save()
    return HttpResponse('done')

@csrf_exempt
def edit_comment(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    commentId = body['commentId']
    text = body['text']
    comment = Comment.objects.get(pk=commentId)
    comment.text = text
    comment.save()
    return HttpResponse('Comment Edited')

@csrf_exempt
def delete_comment(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    commentId = body['commentId']
    comment = Comment.objects.get(pk=commentId)
    comment.delete()
    return HttpResponse('Comment Deleted')

def fetch_followers(request, user_id):
    user = User.objects.get(pk=user_id)
    followings = []
    followingUsers = UserRelation.objects.filter(followed=user).all()
    for relation in followingUsers:
        followingPerson = User.objects.get(pk=relation.follower.id)
        followings.append(followingPerson)
    data = serializers.serialize('json', followings)
    return HttpResponse(data)

def fetch_followings(request, user_id):
    user = User.objects.get(pk=user_id)
    followings = []
    followingUsers = UserRelation.objects.filter(follower=user).all()
    for relation in followingUsers:
        followingPerson = User.objects.get(pk=relation.followed.id)
        followings.append(followingPerson)
    # followings.append(*(user.followingChannels.all()))
    for channel in user.followingChannels.all():
        followings.append(channel)
    data = serializers.serialize('json', followings)
    return HttpResponse(data)
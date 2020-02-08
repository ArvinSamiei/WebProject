from django.db import models
from django import forms
from django.utils import timezone
from rest_framework import serializers

class Channel(models.Model):
    admin = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='admin')
    authors = models.ManyToManyField('User', related_name='authors')
    members = models.ManyToManyField('User', related_name='members')

    posts = models.ManyToManyField('Post', related_name='posts')
    
    name = models.CharField(max_length=30, unique=True)
    title = models.CharField(max_length=50)
    decription = models.CharField(max_length=100)
    rules = models.CharField(max_length=100)

class UserChannelRelation(models.Model):
    the_user = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='the_user')
    the_channel = models.ForeignKey(
        'Channel', on_delete=models.CASCADE, related_name='the_channel')
    relation_type = models.IntegerField()       # {0: admin /1: author /2: follower} of the channel   

    class Meta:
        unique_together = ('the_user', 'the_channel', 'relation_type')


class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=35)
    email = models.EmailField(max_length=254, unique=True)
    image = models.ImageField(upload_to='images/', blank=True)
    last_login = models.DateTimeField(default=timezone.now)
    followingUsers = models.ManyToManyField('self', related_name='following_users', through='UserRelation',
                                            blank=True)
    followingChannels = models.ManyToManyField(
        Channel, blank=True)

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.full_name

    class META:
        fields = ('first_name', 'last_name', 'email', 'image',
                  'last_login', 'followingUsers', 'followingChannels')


class UserRelation(models.Model):
    follower = models.ForeignKey(
        'User', related_name='follower', on_delete=models.CASCADE)
    followed = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='followed')

    class Meta:
        unique_together = ('follower', 'followed',)

    # def findFollowers(self, user):
    #     followingUsers.objects.filter(followed=user).only("follower")
    # def findFollowings(self, user):
    #     UserRelation.objects.filter(follower=user).only("followed")

# class PostSerializer(serializers.Serializer):
#     creater_type = serializers.IntegerField()   
#     creator_id = serializers.IntegerField()
#     title = serializers.CharField()
#     image = serializers.ImageField()
#     text = serializers.TextField()
#     create_date = serializers.DateTimeField()
#     likes = serializers.ManyToManyField()
#     dislikes = serializers.ManyToManyField(
#         )
#     class META:
#         comments = models.ManyToManyField('Comment', blank=True)
#         fields = ( # this needs to be ordered properly
#              'create_date',
#              'id',
#              'creater_type',
#              'creator_id',
#              'title',
#              'image',
#              'text',
#              'likes',
#              'dislikes',
#              'comments'
#          )

class Post(models.Model):
    creater_type = models.IntegerField()
    creator_id = models.IntegerField()
    title = models.CharField(max_length=300)
    image = models.ImageField(upload_to='images/posts', blank=True)
    text = models.TextField()
    create_date = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField('User', related_name='likes', blank=True)
    dislikes = models.ManyToManyField(
        'User', related_name='dislikes', blank=True)
    comments = models.ManyToManyField('Comment', blank=True)

    def __str__(self):
        return self.title
    class META:
        fields = (
             'create_date',
             'id',
             'creater_type',
             'creator_id',
             'title',
             'image',
             'text',
             'likes',
             'dislikes',
             'comments'
         )


class Comment(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    replies = models.ManyToManyField(
        'self', related_name='comment_replies', blank=True, symmetrical=False)
    text = models.TextField()

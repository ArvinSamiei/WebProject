from django.db import models
from django import forms
from django.utils import timezone


class Channel(models.Model):
    admin = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='admin')
    members = models.ManyToManyField('User', related_name='members')


class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=35)
    email = models.EmailField(max_length=254, unique=True)
    image = models.ImageField(upload_to='images/', blank=True)
    last_login = models.TimeField(default=timezone.now)
    followingUsers = models.ManyToManyField('self', related_name='_followingUsers', through='UserRelation',
                                            symmetrical=False, blank=True)
    followingChannels = models.ManyToManyField(
        'Channel', blank=True)

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def findFollowers():
        UserRelation.objects.filter(followed=self).only("follower")

    def __str__(self):
        return self.full_name


class UserRelation(models.Model):
    follower = models.ForeignKey(
        'User', related_name='follower', on_delete=models.CASCADE)
    followed = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='followed')


class Post(models.Model):
    creater_type = models.IntegerField()
    creator_id = models.IntegerField()
    title = models.CharField(max_length=30)
    image = models.ImageField(upload_to='images/posts', blank=True)
    text = models.TextField()
    def __str__(self):
        return self.title
    

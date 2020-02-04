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


class Post(models.Model):
    creater_type = models.IntegerField()
    creator_id = models.IntegerField()
    title = models.CharField(max_length=300)
    image = models.ImageField(upload_to='images/posts', blank=True)
    text = models.TextField()
    create_date = models.DateTimeField(default=timezone.now)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    comments = models.ManyToManyField('Comment')


class Comment(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    replies = models.ManyToManyField('self', related_name='comment_replies')
    text = models.TextField()

    def __str__(self):
        return self.title
    

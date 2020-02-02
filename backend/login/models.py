from django.db import models
from django import forms


class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=35)
    email = models.EmailField(max_length=254, unique=True)
    image = models.ImageField(upload_to='images/', blank=True)

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.full_name

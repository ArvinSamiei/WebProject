from django.urls import path, re_path

from . import views

urlpatterns = [
    path('users/login/', views.login),
    path('users/signup/', views.signup),
    path('users/uploadImage/', views.uploadImage),
    re_path('users/images/(?P<username>.+)$', views.download_image),
    re_path('users/profile/(?P<username>.+)$', views.send_profile),
    path('posts/createPost/', views.createPost)
]

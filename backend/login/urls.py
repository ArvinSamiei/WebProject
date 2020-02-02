from django.urls import path, re_path

from . import views

urlpatterns = [
    path('login/', views.login),
    path('signup/', views.signup),
    path('uploadImage/', views.uploadImage),
    re_path('images/(?P<username>.+)$', views.download_image)
]
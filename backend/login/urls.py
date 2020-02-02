from django.urls import path, re_path

from . import views

urlpatterns = [
    path('users/login/', views.login),
    path('users/signup/', views.signup),
    path('users/uploadImage/', views.uploadImage),
    re_path('users/images/(?P<username>.+)$', views.download_image),
    re_path('users/images/<int:user_id>', views.download_image2),
    re_path('users/profile/(?P<username>.+)$', views.send_profile),
    path('posts/createPost/', views.createPost),
    path('users/profiles/<int:user_id>/', views.fetch_user),
    path('posts', views.fetchAllPosts),
    path('images/posts/<int:post_id>', views.download_image_post),
    
]

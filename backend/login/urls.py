from django.urls import path, re_path

from . import views

urlpatterns = [
    path('users/login/', views.login),
    path('users/signup/', views.signup),
    path('users/uploadImage/', views.uploadImage),
    path('users/images/<int:user_id>', views.download_image2),
    re_path('users/images/(?P<username>.+)$', views.download_image),
    path('user/profile/<int:user_id>', views.send_profile_by_id),
    re_path('users/profile/(?P<username>.+)$', views.send_profile),
    path('posts', views.fetchAllPosts),
    path('posts/createPost/', views.createPost),
    path('users/profiles/<int:user_id>/', views.fetch_user),
    path('images/posts/<int:post_id>', views.download_image_post),
    path('users/othersProfile/<int:id>', views.others_profile),
    path('users/follow', views.follow),
    path('users/changePassword', views.changePassword),
    path('users/changeAccount', views.changeAccount),
    path('posts/detail/', views.fetch_post_detail),
    path('posts/<int:post_id>', views.fetch_post),
    path('comments/<int:comment_id>', views.fetch_comment),
    path('comments/add/', views.add_comment)

]

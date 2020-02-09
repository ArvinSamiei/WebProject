from django.urls import path, re_path

from . import views

urlpatterns = [
    path('comments/add/', views.add_comment),
    path('comments/edit/', views.edit_comment),
    path('comments/delete/', views.delete_comment),
    path('posts/like', views.like),
    path('posts/likesanddislikes/<int:post_id>/', views.likes_and_dislikes),
    path('posts/dislike', views.dislike),
    path('users/login/', views.login),
    path('users/signup/', views.signup),
    path('users/uploadImage/', views.uploadImage),
    path('users/images/<int:user_id>', views.download_image2),
    re_path('users/images/(?P<username>.+)$', views.download_image),
    path('user/profile/<int:user_id>', views.send_profile_by_id),
    re_path('users/profile/(?P<username>.+)$', views.send_profile),
    path('posts', views.fetchAllPosts),
    path('posts/createPost/', views.createPost),
    path('posts/editPost/', views.editPost),
    path('posts/deletePost/', views.deletePost),
    path('users/profiles/<int:user_id>/', views.fetch_user),
    path('images/posts/<int:post_id>', views.download_image_post),
    path('users/othersProfile/<int:id>', views.others_profile),
    path('users/follow', views.follow),
    path('users/changePassword', views.changePassword),
    path('users/changeAccount', views.changeAccount),
    path('posts/detail/', views.fetch_post_detail),
    path('posts/<int:post_id>', views.fetch_post),
    path('comments/<int:comment_id>', views.fetch_comment),
    path('users/<int:user_id>/followers', views.fetch_followers),
    path('users/<int:user_id>/followings', views.fetch_followings),
    path('users/forgotPassword', views.forgot_password),
    
    path('channel/createChannel', views.create_channel),
    path('users/<int:user_id>/viewChannel', views.view_channel),
    path('users/addOrRemoveAuthor', views.add_or_remove_author),
    path('users/followChannel', views.follow_channel),
    path('search/searchPost' , views.searchPost),
    path('search/searchUser' , views.searchUser),
    path('search/searchChannel' , views.searchChannel),


]

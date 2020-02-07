import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import signupReducer from "./signupReducer";
import userReducer from "./userReducer";
import createPost from "./createPost";
import fetchAllPosts from "./fetchAllPosts";
import otherUserInfo from "./otherUserInfo";
import otherUserFollowing from "./otherUserFollowing";
import follow from "./follow";
import unfollow from "./unfollow";
import changePassword from "./changePassword";
import changeAccount from './changeAccount'
import fetchPostDetail from './fetchPostDetail'
import userById from './fetchUserById'
import followers from './fetchFollowers'
import followings from './fetchFollowings'
import likesDislikes from './likesAndDislikes'
import numLikesDislikes from './numLikesDislikes'
import forgotPassword from './forgotPassword'

export default combineReducers({
	login: loginReducer,
	signup: signupReducer,
	user: userReducer,
	createPost,
	fetchAllPosts,
	otherUserFollowing,
	otherUserInfo,
	follow,
	unfollow,
	changePassword,
	changeAccount,
	fetchPostDetail,
	userById,
	followers,
	followings,
	likesDislikes,
	numLikesDislikes,
	forgotPassword
});

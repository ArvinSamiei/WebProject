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
	userById
});

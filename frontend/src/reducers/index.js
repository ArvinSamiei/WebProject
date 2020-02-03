import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import signupReducer from "./signupReducer";
import userReducer from "./userReducer";
import createPost from "./createPost";
import fetchAllPosts from "./fetchAllPosts";
import otherUserInfo from './otherUserInfo'
import otherUserFollowing from './otherUserFollowing'
export default combineReducers({
	login: loginReducer,
	signup: signupReducer,
	user: userReducer,
	createPost,
	fetchAllPosts,
	otherUserFollowing,
	otherUserInfo
});

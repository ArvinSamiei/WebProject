import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import signupReducer from "./signupReducer";
import userReducer from "./userReducer";
import createPost from "./createPost";
import fetchAllPosts from "./fetchAllPosts";
export default combineReducers({
	login: loginReducer,
	signup: signupReducer,
	user: userReducer,
	createPost,
	fetchAllPosts,
});

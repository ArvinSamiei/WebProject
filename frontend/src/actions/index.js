import backend from "../apis/backend";

export const search = searchField => {
	console.log(searchField);
	return function(dispatch) {
		console.log(searchField);
		backend
			.get("search/searchPost", {
				params: {
					query: searchField,
				},
			})
			.then(r => {
				dispatch({ type: "SEARCH_RESULTS_POSTS", payload: r.data });
			});
		backend
			.get("search/searchUser", {
				params: {
					query: searchField,
				},
			})
			.then(r => {
				dispatch({ type: "SEARCH_RESULTS_USERS", payload: r.data });
			});
		backend
			.get("search/searchChannel", {
				params: {
					query: searchField,
				},
			})
			.then(r => {
				dispatch({ type: "SEARCH_RESULTS_CHANNELS", payload: r.data });
			});
	};
};

export const login = (username, password) => {
	return function(dispatch) {
		backend
			.post("users/login/", {
				username,
				password,
			})
			.then(
				r => {
					if (r.status === 200) {
						localStorage.setItem("username", username);
						localStorage.setItem("time", Date.now());
						dispatch({
							type: "LOGIN",
							payload: { success: true, message: r.data.message },
						});
						dispatch(fetchPosts(r.data.id, "Following"));
					}
				},
				e => {
					dispatch({
						type: "LOGIN",
						payload: { success: false, message: e.message },
					});
				},
			);
	};
};

export const signup = (username, password, email, lastname, name, picture) => {
	return function(dispatch) {
		backend
			.post("users/signup/", {
				username,
				password,
				email,
				lastname,
				name,
			})
			.then(
				r => {
					if (r.status === 200) {
						localStorage.setItem("username", username);
						localStorage.setItem("time", Date.now());
						dispatch({
							type: "SIGNUP",
							payload: { success: true, message: r.data.message },
						});
						dispatch(fetchPosts(r.data.id, "Following"));
						dispatch(changeImage(picture, username));
					}
				},
				e => {
					dispatch({
						type: "LOGIN",
						payload: { success: false, message: e.message },
					});
				},
			);
	};
};

export const changeImage = (picture, username) => {
	return function(dispatch) {
		var formData = new FormData();
		formData.append("image", picture[0]);
		formData.append("username", username);
		backend.post("users/uploadImage/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	};
};

export const logout = () => {
	return async function(dispatch) {
		localStorage.removeItem("username");
		localStorage.removeItem("time");
		document.cookie = "id=id; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		dispatch({ type: "LOGOUT" });
	};
};

export const fetchUser = username => {
	return function(dispatch) {
		backend
			.get(`/users/profile/${username}`, {
				username: username,
				withCredentials: true,
			})
			.then(r => {
				dispatch({
					type: "USER_PROFILE",
					payload: { ...r.data[0].fields, id: r.data[0].pk },
				});
			});
	};
};
export const fetchUserById = id => {
	return function(dispatch) {
		backend
			.get(`/user/profile/${id}`, {
				withCredentials: true,
			})
			.then(r => {
				dispatch({
					type: "USER_PROFILE_BY_ID",
					payload: { ...r.data[0].fields, id: r.data[0].pk },
				});
			});
	};
};

const getCookie = name => {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2)
		return parts
			.pop()
			.split(";")
			.shift();
};

export const createPost = (id, title, text, type, image) => {
	return function(dispatch) {
		var formData = new FormData();
		formData.append("image", image[0]);
		formData.append("title", title);
		formData.append("text", text);
		formData.append("type", type);
		formData.append("id", id);
		backend
			.post("posts/createPost/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(
				r => {
					dispatch({
						type: "CREATE_POST",
						payload: { success: true, message: "Post Created" },
					});
				},
				e => {
					if (e.status === 401) {
						dispatch(logout());
					} else {
						dispatch({
							type: "CREATE_POST",
							payload: { success: false, message: e.message },
						});
					}
				},
			);
	};
};

export const fetchPosts = (id, name) => {
	return async function(dispatch) {
		dispatch({ type: "REMOVE_ALL_POSTS", payload: [] });
		try {
			let r = await backend.get(`/posts`, {
				params: {
					id,
					name,
				},
			});
			console.log(r);
			let posts = r.data;
			posts.sort(function(a, b) {
				return a.create_date - b.create_date;
			});

			dispatch({ type: "FETCH_ALL_POSTS", payload: r.data });
			for (let i = 0; i < posts.length; i++) {
				try {
					let user = await backend.get(
						`users/profiles/${posts[i].fields.creator_id}/`,
						{
							id,
						},
					);
					dispatch({
						type: "FETCH_USERS",
						payload: { ...user.data[0].fields, id: user.data[0].pk },
					});
				} catch (e) {
					if (e.status === 401) {
						dispatch({ type: "LOGOUT" });
					}
				}
			}
		} catch (e) {
			if (e.status === 401) {
				dispatch({ type: "LOGOUT" });
			}
		}
	};
};

export const fetchUserAndFollowingState = (myId, hisId) => {
	return async function(dispatch) {
		let r = await backend.get(`users/othersProfile/${hisId}`, {
			params: {
				myId,
			},
		});
		dispatch({
			type: "OTHER_USER_FOLLOWING",
			payload: { following: r.data.following },
		});
		backend
			.get(`users/profiles/${hisId}/`, {
				params: {
					id: myId,
				},
			})
			.then(user => {
				dispatch({
					type: "OTHER_USERS_INFO",
					payload: { ...user.data[0].fields, id: user.data[0].pk },
				});
			});
	};
};

export const follow = (myId, hisId) => {
	return function(dispatch) {
		backend
			.post("/users/follow", {
				myId,
				hisId,
				follow: true,
			})
			.then(
				r => {
					dispatch({
						type: "FOLLOW",
						payload: { success: true, message: r.data },
					});
					dispatch(fetchUserAndFollowingState(myId, hisId));
				},
				e => {
					dispatch({
						type: "FOLLOW",
						payload: { success: false, message: e },
					});
				},
			);
	};
};

export const unfollow = (myId, hisId) => {
	return function(dispatch) {
		backend
			.post("/users/follow", {
				myId,
				hisId,
				follow: false,
			})
			.then(
				r => {
					dispatch({
						type: "UNFOLLOW",
						payload: { success: true, message: r.data },
					});
					dispatch(fetchUserAndFollowingState(myId, hisId));
				},
				e => {
					dispatch({
						type: "UNFOLLOW",
						payload: { success: false, message: e.message },
					});
				},
			);
	};
};

export const changePassword = (id, oldPassword, newPassword) => {
	return function(dispatch) {
		backend
			.post("/users/changePassword", {
				id,
				oldPassword,
				newPassword,
			})
			.then(
				r => {
					dispatch({
						type: "CHANGE_PASSWORD",
						payload: { success: true, message: r.data },
					});
				},
				e => {
					dispatch({
						type: "CHANGE_PASSWORD",
						payload: { success: false, message: e.message },
					});
				},
			);
	};
};

export const changeAccount = (id, name, lastname, email, picture, username) => {
	return function(dispatch) {
		var formData = new FormData();

		formData.append("image", picture[0]);
		formData.append("id", id);
		formData.append("name", name);
		formData.append("lastname", lastname);
		formData.append("email", email);
		backend
			.post("/users/changeAccount", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(
				r => {
					dispatch({
						type: "CHANGE_ACCOUNT",
						payload: { success: true, message: r.data },
					});
					dispatch(fetchUser(username));
					document.location.reload(true);
				},
				e => {
					dispatch({
						type: "CHANGE_ACCOUNT",
						payload: { success: false, message: e.message },
					});
				},
			);
	};
};

export const fetch_post = post_id => {
	return async function(dispatch) {
		try {
			let r = await backend.get(`posts/${post_id}`);
			dispatch({
				type: "FETCH_POST",
				payload: { ...r.data[0].fields, id: r.data[0].pk },
			});
		} catch (e) {}
	};
};

const f = async function(responseData, myData, dispatch) {
	for (let i = 0; i < responseData["1"].length; i++) {
		let comment = await backend.get(`comments/${responseData["1"][i]["0"]}`);

		dispatch(fetchUserById(comment.data[0].fields.creator));
		myData["1"].push({
			"0": { ...comment.data[0].fields, id: comment.data[0].pk },
			"1": [],
		});
		f(responseData["1"][i], myData["1"][i], dispatch);
	}
};

export const fetchPost = postId => {
	return function(dispatch) {
		backend
			.get(`posts/${postId}`, {
				params: {
					id: postId,
				},
			})
			.then(r => {
				dispatch({
					type: "FETCH_POST",
					payload: { ...r.data[0].fields, id: r.data[0].pk },
				});
			});
	};
};

export const editPost = (postId, title, text, image) => {
	return function(dispatch) {
		var formData = new FormData();
		formData.append("image", image[0]);
		formData.append("title", title);
		formData.append("text", text);
		formData.append("postId", postId);
		backend
			.post("posts/editPost/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(r => {
				console.log(r);
			});
	};
};

export const deletePost = postId => {
	return function(dispatch) {
		backend
			.post("posts/deletePost/", {
				postId,
			})
			.then(r => {
				console.log(r);
			});
	};
};

export const fetchPostDetail = id => {
	return async function(dispatch) {
		let r = await backend.get("posts/detail/", {
			params: {
				id,
			},
		});

		let data = {};
		let post = await backend.get(`posts/${r.data["0"]}`);
		data["0"] = { ...post.data[0].fields, id: post.data[0].pk };
		dispatch(fetchUserById(post.data[0].fields.creator_id));
		data["1"] = [];
		for (let i = 0; i < r.data["1"].length; i++) {
			let comment = await backend.get(`comments/${r.data["1"][i]["0"]}`);
			dispatch(fetchUserById(comment.data[0].fields.creator));
			data["1"].push({
				"0": { ...comment.data[0].fields, id: comment.data[0].pk },
				"1": [],
			});
			f(r.data["1"][i], data["1"][i], dispatch);
		}
		dispatch({ type: "FETCH_POST_DETAIL", payload: data });
		dispatch({
			type: "NUM_LIKES_DISLIKES",
			payload: {
				likes: post.data[0].fields.likes.length,
				dislikes: post.data[0].fields.dislikes.length,
			},
		});
	};
};

export const addComment = (postId, parentId, fromPost, myId, text) => {
	return function(dispatch) {
		backend
			.post("comments/add/", {
				parentId,
				fromPost,
				myId,
				text,
			})
			.then(r => {
				dispatch(fetchPostDetail(postId));
			});
	};
};

export const like = (postId, userId) => {
	return function(dispatch) {
		backend
			.post("posts/like", {
				postId,
				userId,
			})
			.then(r => {
				dispatch({
					type: "NUM_LIKES_DISLIKES",
					payload: { likes: r.data.likes, dislikes: r.data.dislikes },
				});
				dispatch(likesAndDislikes(postId, userId));
			});
	};
};

export const dislike = (postId, userId) => {
	return function(dispatch) {
		backend
			.post("posts/dislike", {
				postId,
				userId,
			})
			.then(r => {
				dispatch({
					type: "NUM_LIKES_DISLIKES",
					payload: { likes: r.data.likes, dislikes: r.data.dislikes },
				});
				dispatch(likesAndDislikes(postId, userId));
			});
	};
};

export const likesAndDislikes = (postId, userId) => {
	return function(dispatch) {
		backend
			.get(`posts/likesanddislikes/${postId}/`, {
				params: { userId },
			})
			.then(r => {
				console.log(r.data.state);
				dispatch({ type: "LIKES_AND_DISLIKES", payload: Number(r.data.state) });
			});
	};
};

export const deleteComment = (commentId, postId) => {
	return function(dispatch) {
		backend
			.post("comments/delete/", {
				commentId,
			})
			.then(r => {
				dispatch(fetchPostDetail(postId));
			});
	};
};

export const editComment = (commentId, postId, text) => {
	return function(dispatch) {
		backend
			.post("comments/edit/", {
				commentId,
				text,
			})
			.then(r => {
				dispatch(fetchPostDetail(postId));
			});
	};
};

export const fetchFollowers = userId => {
	return function(dispatch) {
		backend.get(`users/${userId}/followers`).then(r => {
			dispatch({ type: "FOLLOWERS", payload: r.data });
		});
	};
};

export const fetchFollowings = userId => {
	return function(dispatch) {
		backend.get(`users/${userId}/followings`).then(r => {
			dispatch({ type: "FOLLOWINGS", payload: r.data });
		});
	};
};

export const forgotPassword = email => {
	return function(dispatch) {
		backend.post("users/forgotPassword", { email }).then(r => {
			dispatch({
				type: "FORGOT_PASSWORD",
				payload: { success: r.data.success, message: r.data.message },
			});
		});
	};
};

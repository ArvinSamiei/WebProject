import backend from "../apis/backend";

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
						document.cookie = `username=${username}`;
						dispatch({
							type: "LOGIN",
							payload: { success: true, message: r.data.message },
						});
						console.log(r)
						dispatch(fetchPosts(r.data.id, 'Following'))
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
	return async function(dispatch) {
		await backend
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
						document.cookie = `username=${username}`;
						setTimeout(() => {
							localStorage.removeItem();
						});
						dispatch({
							type: "SIGNUP",
							payload: { success: true, message: r.message },
						});
					}
				},
				e => {
					dispatch({
						type: "LOGIN",
						payload: { success: false, message: e.message },
					});
				},
			);
		dispatch(changeImage(picture, username));
	};
};

export const changeImage = (picture, username) => {
	return function(dispatch) {
		var formData = new FormData();
		// formData.append("name", this.state.name);
		formData.append("image", picture[0]);
		formData.append("username", username);
		backend.post("users/uploadImage/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Cookie: document.cookie,
			},
		});
	};
};

export const logout = () => {
	return async function(dispatch) {
		localStorage.removeItem("username");
		localStorage.removeItem("time");
		document.cookie =
			"username=username; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		dispatch({ type: "LOGOUT" });
		
	};
};

export const fetchUser = username => {
	return function(dispatch) {
		backend
			.get(`/users/profile/${username}`, { username: username })
			.then(r => {
				dispatch({
					type: "USER_PROFILE",
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
					Cookie: document.cookie,
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
		try {
			let r = await backend.get(`/posts`, {
				params: {
					id,
					name,
				},
			});
			let posts = r.data;
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
		console.log(r.data.following);
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
					console.log(e);
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
					console.log(e);
					dispatch({
						type: "UNFOLLOW",
						payload: { success: false, message: e.data },
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
						payload: { success: false, message: e.data },
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
					dispatch({ type: "CHANGE_ACCOUNT", payload: { success: true, message: r.data } });
					dispatch(fetchUser(username))
					document.location.reload(true)
				},
				e => {
					dispatch({ type: "CHANGE_ACCOUNT", payload: { success: false, message: e.data } });
				},
			);
	};
};

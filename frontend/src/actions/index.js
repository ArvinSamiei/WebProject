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
						console.log(r.headers);
						document.cookie = `username=${username}`;
						dispatch({
							type: "LOGIN",
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
		document.cookie = "";
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
	if (parts.length == 2)
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
					if (e.status == 401) {
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

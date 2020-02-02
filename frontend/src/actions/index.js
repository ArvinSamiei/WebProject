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
			dispatch(changeImage(picture, username))
	};
};

export const changeImage = (picture, username) => {
	return function(dispatch) {
		var formData = new FormData();
		// formData.append("name", this.state.name);
		formData.append("image", picture[0]);
		formData.append("username", username)
		backend.post("users/uploadImage/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	};
};

import backend from "../apis/backend";

export const login = (username, password) => {
	return function(dispatch) {
		backend
			.post("users/login/", {
				username,
				password,
			})
			.then(r => {
                if(r.status === 200){
                    localStorage.setItem('username', username)
                    dispatch({ type: "LOGIN", payload: {success: true, message: r.message} });
                }
                    else
                        dispatch({ type: "LOGIN", payload: {success: false, message: r.message } });
			});
	};
};

export const signup = (username, password, email) => {
	return function(dispatch) {
		backend
			.post("users/signup/", {
				username,
				password,
				email,
			})
			.then(r => {
                if(r.status === 200){
                    localStorage.setItem('username', username)
                    dispatch({ type: "SIGNUP", payload: {success: true, message: r.message } });
                }
                else
                    dispatch({ type: "SIGNUP", payload: {success: false, message: r.message } });
			});
	};
};

export default (state = { success: false, message: "" }, action) => {
	switch (action.type) {
		case "FORGOT_PASSWORD":
            return action.payload;
		default:
			return state;
	}
};

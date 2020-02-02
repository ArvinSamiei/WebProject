export default (state = { success: false, message: "" }, action) => {
	switch (action.type) {
		case "SIGNUP":
			return action.payload;
		case "LOGOUT":
			return { success: false, message: "" };
		default:
			return state;
	}
};

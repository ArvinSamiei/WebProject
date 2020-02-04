export default (state = { success: false, message: "" }, action) => {
	switch (action.type) {
		case "UNFOLLOW":
			return action.payload;
		case "FOLLOW":
			return { success: !action.payload.success, message: "" };
		default:
			return state;
	}
};

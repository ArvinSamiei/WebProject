export default (state = null, action) => {
	switch (action.type) {
		case "USER_PROFILE":
			return action.payload;
		default:
			return state;
	}
};

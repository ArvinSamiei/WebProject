export default (state = false, action) => {
	switch (action.type) {
		case "OTHER_USER_FOLLOWING":
			return action.payload;
		default:
			return state;
	}
};

export default (state = null, action) => {
	switch (action.type) {
		case "OTHER_USERS_INFO":
			return action.payload;
		default:
			return state;
	}
};

export default (state = [], action) => {
	switch (action.type) {
		case "FOLLOWINGS":
			return action.payload;
		default:
            return state
	}
};

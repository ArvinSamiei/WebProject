export default (state = [], action) => {
	switch (action.type) {
		case "FOLLOWERS":
			return action.payload;
		default:
            return state
	}
};

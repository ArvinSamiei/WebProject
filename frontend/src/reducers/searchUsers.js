export default (state = null, action) => {
	switch (action.type) {
		case "SEARCH_RESULTS_USERS":
			return action.payload;
		default:
			return state;
	}
};

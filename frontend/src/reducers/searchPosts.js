export default (state = null, action) => {
	switch (action.type) {
		case "SEARCH_RESULTS_POSTS":
			return action.payload;
		default:
			return state;
	}
};

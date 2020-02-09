export default (state = null, action) => {
	switch (action.type) {
		case "SEARCH_RESULTS_CHANNELS":
			return action.payload;
		default:
			return state;
	}
};

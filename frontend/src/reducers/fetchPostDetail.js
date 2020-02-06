export default (state = null, action) => {
	switch (action.type) {
		case "FETCH_POST_DETAIL":
			return action.payload;
		default:
            return state
	}
};

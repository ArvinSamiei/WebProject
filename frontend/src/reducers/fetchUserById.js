export default (state = [null], action) => {
	switch (action.type) {
		case "USER_PROFILE_BY_ID":
			return [...state, action.payload];
		default:
			return state;
	}
};

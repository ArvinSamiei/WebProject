export default (state = 2, action) => {
	switch (action.type) {
		case "LIKES_AND_DISLIKES":
			return action.payload;
		default:
			return state;
	}
};

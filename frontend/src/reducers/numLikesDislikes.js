export default (state = {likes: 0, dislikes: 0}, action) => {
	switch (action.type) {
		case "NUM_LIKES_DISLIKES":
			return action.payload;
		default:
			return state;
	}
};

export default (state = { success: false, message: "" }, action) => {
	switch (action.type) {
		case "FOLLOW":
            return action.payload;
        case "UNFOLLOW":
            return {success: !action.payload.success, message: ''}
		default:
			return state;
	}
};

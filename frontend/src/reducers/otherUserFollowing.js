export default (state = {follow: false, tried: false}, action) => {
	switch (action.type) {
		case "OTHER_USER_FOLLOWING":
			return {follow: action.payload.following, tried: true}
		default:
			return state;
	}
};

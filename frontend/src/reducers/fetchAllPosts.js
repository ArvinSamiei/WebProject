export default (state = { posts: [], users: [] }, action) => {
	switch (action.type) {
		case "FETCH_ALL_POSTS":
			return { posts: action.payload, users: state.users };
		case "FETCH_USERS":
			return { posts: state.posts, users: [...state.users, action.payload] };
		case "REMOVE_ALL_POSTS":
			state = {posts: [], users: state.users}
		default:
            return state
	}
};

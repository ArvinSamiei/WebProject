import React from "react";
import Post from "./Post";
import "./PostList.css";
class PostList extends React.Component {
	render() {
		const posts = this.props.posts.map(post => {
			return <Post key={post.id} post={post} />;
		});
		return <div className="post-list">{posts}</div>;
	}
}

export default PostList;

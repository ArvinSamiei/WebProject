import React from "react";
import Post from "./Post";
import { connect } from "react-redux";
import "./PostList.css";
import { fetchPosts } from "../../actions";
class PostList extends React.Component {
	componentDidMount(){
		this.props.fetchPosts()
	}

	render() {
		if(!this.props.posts){
			return null;
		}
		console.log(this.props.posts)
		const posts = this.props.posts.map(post => {
			console.log(this.props.posts)
			return <Post key={post.pk} post={post} users={this.props.users} />;
		});
		return <div className="post-list">{posts}</div>;
	}
}

const mapStateToProps = state => {
	console.log('heil')
	console.log(state)
	return { posts: state.fetchAllPosts.posts, users: state.fetchAllPosts.users };
};

export default connect(mapStateToProps, { fetchPosts })(PostList);

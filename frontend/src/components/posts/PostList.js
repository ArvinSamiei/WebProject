import React from "react";
import Post from "./Post";
import { connect } from "react-redux";
import "./PostList.css";
import { fetchPosts, fetchUser } from "../../actions";
import { withRouter } from "react-router-dom";

const SomeComponent = withRouter(props => <PostList {...props} />);
class PostList extends React.Component {
	state = { type: "", chosen: "Following" };

	componentDidMount() {
		this.props.fetchUser(localStorage.getItem("username"));
		if (this.props.user) this.props.fetchPosts(this.props.user.id, "Following");
	}

	handleChange = (name, path) => {
		this.setState({ chosen: name });
		this.props.fetchPosts(this.props.user.id, name);
	};

	renderLink = (name, path) => {
		if (this.props.location.pathname == path) {
			return (
				<button
					style={{ margin: "10px 10px 10px 10px" }}
					className={
						this.state.chosen == name ? "btn btn-success" : "btn btn-primary"
					}
					onClick={e => this.handleChange(name, path)}
				>
					{name}
				</button>
			);
		} else {
			return (
				<button
					style={{ margin: "10px 10px 10px 10px" }}
					className={
						this.state.chosen == name ? "btn btn-success" : "btn btn-primary"
					}
					onClick={e => this.handleChange(name, path)}
				>
					{name}
				</button>
			);
		}
	};

	render() {
		if (!this.props.posts) {
			return null;
		}
		const posts = this.props.posts.map(post => {
			return <Post key={post.pk} post={post} users={this.props.users} />;
		});
		return (
			<div className="container">
				<div className="row">
					{this.renderLink("Following", "/")}
					{this.renderLink("Newests", "/newests")}
					{this.renderLink("Breakings", "/breakings")}
					{this.renderLink("Participatings", "/participating")}
				</div>
				<div className="row post-list">{posts}</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		posts: state.fetchAllPosts.posts,
		users: state.fetchAllPosts.users,
		user: state.user,
	};
};

export default connect(mapStateToProps, { fetchPosts, fetchUser })(PostList);

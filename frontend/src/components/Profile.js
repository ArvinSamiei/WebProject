import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, fetchPosts, fetchFollowers, fetchFollowings } from "../actions";
import { Link } from "react-router-dom";
import Post from "./posts/Post";
import "./Profile.css";

export class Profile extends Component {
	componentDidMount() {
		this.props.fetchFollowers(this.getCookie("id"));
		this.props.fetchFollowings(this.getCookie("id"));
		this.props.fetchUser(localStorage.getItem("username"));
		if (this.props.user) this.props.fetchPosts(this.props.user.id, "Following");
		else {
			this.props.fetchPosts(this.getCookie("id"), "Following");
		}
	}

	getCookie = name => {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length === 2)
			return parts
				.pop()
				.split(";")
				.shift();
	};

	renderFollowers = () => {
		if (!this.props.followers) {
			return null;
		}
		const followers = this.props.followers.map(follower => {
			return (
				<li className="list-group-item">
					<Link
						to={`/profile/${follower.pk}`}
						style={{ textAlign: "center" }}
						// className="list-group-item list-group-item-action active"
					>
						<h5>
							<img
								src={`http://localhost:8000/users/images/${follower.fields.username}`}
								style={{ width: "50px", height: "50px" }}
							/>
							&nbsp;&nbsp;{follower.fields.first_name}{" "}
							{follower.fields.last_name}
						</h5>
					</Link>
				</li>
			);
		});
		return (
			<div
				style={{
					borderTop: "10px solid",
					marginTop: "10px",
					alignContent: "center",
					alignItems: "center",
					marginLeft: "10px",
				}}
				// className="list-group container"
			>
				<h1>Followers:</h1> <br />
				<ul className="list-group list-group-flush">{followers}</ul>
			</div>
		);
	};

	renderFollowings = () => {
		if (!this.props.followings) {
			return null;
		}
		const followings = this.props.followings.map(following => {
			return (
				<li className="list-group-item">
					<Link
						to={`/profile/${following.pk}`}
						style={{ textAlign: "center" }}
						// className="list-group-item list-group-item-action active"
					>
						<h5>
							<img
								src={`http://localhost:8000/users/images/${following.fields.username}`}
								style={{ width: "50px", height: "50px" }}
							/>
							&nbsp;&nbsp;{following.fields.first_name}{" "}
							{following.fields.last_name}
						</h5>
					</Link>
				</li>
			);
		});
		return (
			<div
				style={{
					borderTop: "10px solid",
					marginTop: "10px",
					alignContent: "center",
					alignItems: "center",
					marginLeft: "10px",
				}}
				// className="list-group container"
			>
				<h1>Followings:</h1> <br />
				<ul className="list-group list-group-flush">{followings}</ul>
			</div>
		);
	};

	render() {
		if (!this.props.user) {
			return null;
		}
		const posts = this.props.posts.map(post => {
			return <Post key={post.pk} post={post} users={this.props.users} />;
		});
		return (
			<div className="profile">
				<div
					className="card col-"
					style={{ float: "left", display: "inline-block" }}
				>
					<img
						style={{ width: "100%" }}
						src={`http://localhost:8000/users/images/${this.props.user.username}`}
						alt=""
						className="img-rounded img-responsive"
					/>
					<div class="jumbotron">
						<div class="container text-center">
							<h1>{`${this.props.user.first_name} ${this.props.user.last_name}`}</h1>
							{/* <p>Some text that represents "Me"...</p> */}
							<p className="title">
								<img src="https://img.icons8.com/cotton/64/000000/email-open.png" />
								{this.props.user.email}
								<br />
							</p>
						</div>
					</div>
					<div className="col-" style={{ display: "block" }}>
						<p>
							<Link className="linke" to="/createPost">
								Create Post
							</Link>
							<Link className="linke" to="/">
								View Following Posts
							</Link>
							<Link className="linke" to="/changePassword">
								Change Password
							</Link>
							<Link className="linke" to="/changeAccount">
								Change Account
							</Link>
						</p>
					</div>
					{/* <h1>{`${this.props.user.first_name} ${this.props.user.last_name}`}</h1> */}
				</div>
				<div>
					<div style={{ marginTop: "10px" }} className="col-sm post-list">
						{posts}
					</div>

					{this.renderFollowers()}
					{this.renderFollowings()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
		posts: state.fetchAllPosts.posts,
		users: state.fetchAllPosts.users,
		followers: state.followers,
		followings: state.followings
	};
};

export default connect(mapStateToProps, {
	fetchUser,
	fetchPosts,
	fetchFollowers,
	fetchFollowings
})(Profile);

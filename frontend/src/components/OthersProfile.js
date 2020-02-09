import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
import { fetchUserAndFollowingState, follow, unfollow } from "../actions";
import { Link } from "react-router-dom";
import "./Profile.css";

export class Profile extends Component {
	state = { triedFollow: false, triedUnfollow: false };
	componentDidMount() {
		this.props.fetchUser(localStorage.getItem("username"));
		if (this.props.user) {
			this.props.fetchUserAndFollowingState(this.getCookie('id'), this.props.id);
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



	renderButtonText = () => {
		if (this.props.otherUserFollowing.follow) {
			return "Unfollow";
		} else {
			return "Follow";
		}
	};

	renderButton = () => {
		if (this.props.user.id == this.props.id) {
			return (
				<p>
					<Link to="/createPost">Create Post</Link>
				</p>
			);
		} else {
			return (
				<button className="follow" onClick={this.handleClick}>
					{this.renderButtonText()}
				</button>
			);
		}
	};

	handleClick = () => {
		if (!this.props.otherUserFollowing.follow) {
			this.setState({ triedFollow: true });
			this.setState({ triedUnfollow: false });
			this.props.follow(this.props.user.id, this.props.id);
		} else {
			this.setState({ triedUnfollow: true });
			this.setState({ triedFollow: false });
			this.props.unfollow(this.props.user.id, this.props.id);
		}
	};

	renderText = () => {
		if (!this.state.triedFollow && !this.state.triedUnfollow) {
			return null;
		}
		if (!this.props.followState.success && this.state.triedFollow) {
			return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.props.follow.message}
				</div>
			);
		} else if (this.props.followState.success && this.state.triedFollow) {
			return (
				<div className="p-3 mb-2 bg-success text-white">
					{this.props.followState.message}
				</div>
			);
		} else if (!this.props.unfollowState.success && this.state.triedUnfollow) {
			return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.props.unfollowState.message}
				</div>
			);
		} else if (this.props.unfollowState.success && this.state.triedUnfollow) {
			return (
				<div className="p-3 mb-2 bg-success text-white">
					{this.props.unfollowState.message}
				</div>
			);
		}
	};

	render() {
		if (!this.props.otherUser) {
			this.props.fetchUserAndFollowingState(this.getCookie('id'), this.props.id);
			return null;
		}
		return (
			<div>
				{this.renderText()}
				<div className="card" style={{ float: "left" }}>
					<img
						style={{ width: "100%" }}
						src={`http://localhost:8000/users/images/${this.props.otherUser.username}`}
						alt=""
						className="img-rounded img-responsive"
					/>
					<h1>{`${this.props.otherUser.first_name} ${this.props.otherUser.last_name}`}</h1>
					<p className="title">
						<img src="https://img.icons8.com/cotton/64/000000/email-open.png" />
						{this.props.otherUser.email}
						<br />
					</p>
					<p>{this.renderButton()}</p>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
		otherUser: state.otherUserInfo,
		otherUserFollowing: state.otherUserFollowing,
		followState: state.follow,
		unfollowState: state.unfollow,
	};
};

export default connect(mapStateToProps, {
	fetchUser,
	fetchUserAndFollowingState,
	follow,
	unfollow,
})(Profile);

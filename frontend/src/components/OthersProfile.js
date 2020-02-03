import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
import { fetchUserAndFollowingState } from "../actions";
import { Link } from "react-router-dom";
import "./Profile.css";

export class Profile extends Component {
	componentDidMount() {
		this.props.fetchUser(localStorage.getItem("username"));
		if (this.props.user) {
			this.props.fetchUserAndFollowingState(
				this.props.user.id,
				this.props.id,
			);
		}
    }
    
    renderButtonText = () => {
        if (this.props.otherUserFollowing){
            return 'Unfollow'
        }
        else{
            return 'Follow'
        }
    }

	render() {
		if (!this.props.otherUser) {
			return null;
		}
		return (
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
				<p>
                <Link to="/createPost">{this.renderButtonText()}</Link>
				</p>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
		otherUser: state.otherUserInfo,
		otherUserFollowing: state.otherUserFollowing,
	};
};

export default connect(mapStateToProps, { fetchUser, fetchUserAndFollowingState })(Profile);

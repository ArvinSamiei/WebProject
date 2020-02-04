import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
import { Link } from "react-router-dom";
import './Profile.css'

export class Profile extends Component {
	componentDidMount() {
		this.props.fetchUser(localStorage.getItem("username"));
	}

	render() {
		if (!this.props.user) {
			return null;
		}
		return (
			<div className="card" style={{float: 'left'}}>
				<img
					style={{ width: "100%" }}
					src={`http://localhost:8000/users/images/${this.props.user.username}`}
					alt=""
					className="img-rounded img-responsive"
				/>
				<h1>{`${this.props.user.first_name} ${this.props.user.last_name}`}</h1>
				<p className="title">
					<img src="https://img.icons8.com/cotton/64/000000/email-open.png" />
					{this.props.user.email}
					<br />
				</p>
				<p>
					<Link to="/createPost">
						Create Post
					</Link>
					<Link style={{marginTop: '10px'}} to="/">
						View Following Posts
					</Link>
				</p>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
	};
};

export default connect(mapStateToProps, { fetchUser })(Profile);

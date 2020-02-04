import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout } from "../actions";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export class Header extends Component {
	renderLogin = () => {
		if (
			!this.props.isLoggedIn &&
			!this.props.isSignedup &&
			!localStorage.getItem("username")
		) {
			return (
				<li className="nav-item">
					<Link
						className="nav-link"
						to="/login"
						onClick={e => {
							e.stopPropagation();
							
						}}
					>
						Login
					</Link>
				</li>
			);
		} else {
			return null;
		}
	};

	renderSignup = () => {
		if (
			!this.props.isLoggedIn &&
			!this.props.isSignedup &&
			!localStorage.getItem("username")
		) {
			return (
				<li className="nav-item">
					<Link
						className="nav-link"
						to="/signup"
						onClick={e => {
							e.stopPropagation();
						}}
					>
						Signup
					</Link>
				</li>
			);
		} else {
			return null;
		}
	};

	renderProfile = () => {
		if (
			!(
				!this.props.isLoggedIn &&
				!this.props.isSignedup &&
				!localStorage.getItem("username")
			)
		) {
			return (
				<li className="nav-item">
					<Link
						className="nav-link"
						to="/profile"
						onClick={e => {
							e.stopPropagation();
						}}
					>
						Profile
					</Link>
				</li>
			);
		} else {
			return null;
		}
	};

	renderLogout = () => {
		if (
			!(!this.props.isLoggedIn && !this.props.isSignedup && !localStorage.getItem("username"))
		) {
			return (
				<li className="nav-item">
					<Link
						className="nav-link"
						to="/login"
						onClick={e => {
							e.stopPropagation();
							localStorage.removeItem("username")
							this.props.logout();
							window.location.href='/login'
						}}
					>
						Logout
					</Link>
				</li>
			);
		} else {
			return null;
		}
	};

	renderImage = () => {
		let username = localStorage.getItem("username");
		if (username) {
			return (
				<img
					style={{ width: "30px", height: "30px" }}
					src={`http://localhost:8000/users/images/${username}`}
				></img>
			);
		} else {
			return null;
		}
	};

	render() {
		
		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				{this.renderImage()}
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item active">
							<Link
								className="nav-link"
								to="/"
								onClick={e => {
									e.stopPropagation();
								}}
							>
								Home <span className="sr-only">(current)</span>
							</Link>
						</li>
						{this.renderLogin()}
						{this.renderSignup()}
						{this.renderProfile()}
						{this.renderLogout()}
					</ul>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = state => ({
	isLoggedIn: state.login.success,
	isSignedup: state.signup.success,
});

export default connect(mapStateToProps, { logout })(Header);

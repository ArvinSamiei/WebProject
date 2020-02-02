import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../actions";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export class Header extends Component {
	renderLogin = () => {
		if (
			(!this.props.isLoggedIn && !this.props.isSignedup) ||
			localStorage.getItem("username")
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
			(!this.props.isLoggedIn && !this.props.isSignedup) ||
			localStorage.getItem("username")
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

	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-dark">
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
									Home <span class="sr-only">(current)</span>
								</Link>
						</li>
						{this.renderLogin()}
						{this.renderSignup()}
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

export default connect(mapStateToProps)(Header);

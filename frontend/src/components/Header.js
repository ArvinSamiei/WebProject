import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, search } from "../actions";
import { Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchField from "react-search-field";


export class Header extends Component {
	state = {toResults: false, query: ''}
	renderLogin = () => {
		if (
			!this.props.isLoggedIn &&
			!this.props.isSignedup &&
			!document.cookie
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
			!document.cookie
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
				!document.cookie
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
			!(!this.props.isLoggedIn && !this.props.isSignedup && !document.cookie)
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

	handleChange = (e) => {
		this.setState({query: e.target.value})
	}
	
	
	
	renderSearchbar = () => {

		if (
			!(!this.props.isLoggedIn && !this.props.isSignedup && !document.cookie)
		) {
			return (
				<li style={{float: 'right'}} className="nav-item">
				<input
					type='text'
					id = 'search'
  					placeholder="Search..."
					classNames="test-class"
					searchText = {''}
					// onSearchClick = {this.gotoResults}
					// onEnter = {this.gotoResults}
					onChange={this.handleChange}

				/>
				<Link to={`/searchResults/${this.state.query}`}><img style={{width: '30px', height: '30px'}} src="https://img.icons8.com/pastel-glyph/64/000000/search--v1.png" /></Link>
				</li>
				);
		} else {
			return null;
		}	

	};

	gotoResults = () => {
		this.setState({ toResults: true })
	}
	

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
		// if(this.state.toResults) {
		// 	return <Redirect to={`/searchResults/${this.state.query}`} />
		// }
		
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
						{this.renderSearchbar()}
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

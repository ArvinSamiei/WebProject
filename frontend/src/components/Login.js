import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../actions";
import { Redirect } from "react-router-dom";


export class Login extends Component {
	state = { username: "", password: "" };

	renderText = () => {
		if (!this.props.isLoggedIn) {
			return <div>{this.props.messageText}</div>;
		} else {
		}
	};

	handleUserChange = (evt) => {
		this.setState({
			username: evt.target.value,
		});
	}

	handlePassChange = (evt) => {
		this.setState({
			password: evt.target.value,
		});
    }
    
    handleSubmit = (evt) => {
		evt.preventDefault()
        this.props.login(this.state.username, this.state.password)
    }

	render() {
		if (this.props.isLoggedIn) {
			return <Redirect to="/" />;
		}
		return (
			<div className="container">
				{this.renderText()}

				<div className="Login">
					<form onSubmit={this.handleSubmit}>
						{this.state.error && (
							<h3 data-test="error" onClick={this.dismissError}>
								<button onClick={this.dismissError}>✖</button>
								{this.state.error}
							</h3>
						)}
						<div className="form-group">
							<label htmlFor="username">Username: </label>
							<input
								value={this.state.username}
								onChange={this.handleUserChange}
								id="username"
								className="form-control"
								type="text"
								placeholder="Username"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Password"
								value={this.state.password}
								onChange={this.handlePassChange}
							/>
						</div>
						<button onSubmit={e => {this.handleSubmit(e)}} type="submit" className="btn btn-primary">
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isLoggedIn: state.login.success,
	messageText: state.login.message,
});

export default connect(mapStateToProps, { login })(Login);

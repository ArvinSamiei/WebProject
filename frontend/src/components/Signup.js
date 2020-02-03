import React, { Component } from "react";
import { connect } from "react-redux";
import { signup } from "../actions";
import { Redirect } from "react-router-dom";
import ImageUploader from "react-images-upload";

class Signup extends Component {
	state = {
		name: "",
		lastname: "",
		email: "",
		username: "",
		password: "",
		tried: false,
		picture: [],
	};

	renderText = () => {
		if (!this.props.isLoggedIn && this.props.messageText) {
			return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.props.messageText}
				</div>
			);
		} else {
		}
	};

	handleNameChange = evt => {
		this.setState({
			name: evt.target.value,
		});
	};
	handleLastnameChange = evt => {
		this.setState({
			lastname: evt.target.value,
		});
	};

	handleEmailChange = evt => {
		this.setState({
			email: evt.target.value,
		});
	};

	handleUserChange = evt => {
		this.setState({
			username: evt.target.value,
		});
	};

	handlePassChange = evt => {
		this.setState({
			password: evt.target.value,
		});
	};

	handleSubmit = evt => {
		this.setState({ tried: true });
		evt.preventDefault();
		this.props.signup(
			this.state.username,
			this.state.password,
			this.state.email,
			this.state.lastname,
			this.state.name,
			this.state.picture,
		);
	};
	onDrop = (picture) => {
        this.setState({
            picture: this.state.picture.concat(picture),
        });
    }

	render() {
		if (this.props.isLoggedIn) {
			return <Redirect to="/" />;
		}
		return (
			<div className="container">
				{this.renderText()}

				<div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="name">Name: </label>
							<input
								value={this.state.name}
								onChange={this.handleNameChange}
								id="name"
								className="form-control"
								type="text"
								placeholder="Name"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="lastname">Last Name: </label>
							<input
								value={this.state.lastname}
								onChange={this.handleLastnameChange}
								id="lastname"
								className="form-control"
								type="text"
								placeholder="Last Name"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">Email: </label>
							<input
								value={this.state.email}
								onChange={this.handleEmailChange}
								id="email"
								className="form-control"
								type="email"
								placeholder="email"
							/>
						</div>
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
						<ImageUploader
							withIcon={true}
							buttonText="Choose Image"
							onChange={this.onDrop}
							imgExtension={[".jpg", ".gif", ".png", ".gif"]}
							maxFileSize={5242880}
							singleImage={true}
						/>
						<button
							onSubmit={e => {
								this.handleSubmit(e);
							}}
							type="submit"
							className="btn btn-primary"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
    return ({
    
	isLoggedIn: state.signup.success,
	messageText: state.signup.message,
})};

export default connect(mapStateToProps, { signup })(Signup);

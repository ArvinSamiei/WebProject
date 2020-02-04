import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, changeAccount } from "../actions";
import ImageUploader from "react-images-upload";
import {Link} from 'react-router-dom'
class Signup extends Component {
	state = {
		name: "",
		lastname: "",
		email: "",
		tried: false,
		picture: [],
	};

	componentDidMount() {
		this.props.fetchUser(localStorage.getItem("username"));
	}

	renderText = () => {
		if (
			!this.props.changeAccountStat.success &&
			this.props.changeAccountStat.message
		) {
			return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.props.changeAccountStat.message}
				</div>
			);
		} else if (
			this.props.changeAccountStat.success &&
			this.props.changeAccountStat.message
		) {
			return (
				<div className="p-3 mb-2 bg-success text-white">
					{this.props.changeAccountStat.message}
				</div>
			);
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

	handleSubmit = evt => {
		this.setState({ tried: true });
		evt.preventDefault();
		this.props.changeAccount(
			this.props.user.id,
			this.state.name,
			this.state.lastname,
			this.state.email,
            this.state.picture,
            localStorage.getItem('username')
        );
        window.scrollTo(0, 0)
	};
	onDrop = picture => {
		this.setState({
			picture: this.state.picture.concat(picture),
		});
	};

	render() {
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
                        <Link
							style={{ marginLeft: "10px" }}
							className="row btn btn-primary"
							to="/profile"
							onClick={e => {
								e.stopPropagation();
							}}
						>
							Back
						</Link>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
		changeAccountStat: state.changeAccount,
	};
};

export default connect(mapStateToProps, { fetchUser, changeAccount })(Signup);

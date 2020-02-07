import React, { Component } from "react";
import { connect } from "react-redux";
import { forgotPassword } from "../actions";

class ForgotPassword extends Component {
	state = { tried: false, email: "" };

	handleChange = e => {
		this.setState({ email: e.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		this.setState({ tried: true });
		console.log(this.props.forgotPassword);
		this.props.forgotPassword(this.state.email);
	};

	renderText = () => {
		if (!this.state.tried || !this.props.forgotPasswordStat.message) {
			return null;
		} else {
			if (this.props.forgotPasswordStat.success) {
				return (
					<div className="p-3 mb-2 bg-success text-white">
						{this.props.forgotPasswordStat.message}
					</div>
				);
			} else {
				return (
					<div className="p-3 mb-2 bg-danger text-white">
						{this.props.forgotPasswordStat.message}
					</div>
				);
			}
		}
	};

	render() {
		return (
			<div className="container">
				{this.renderText()}

				<div>
					<form onSubmit={this.handleSubmit}>
						<div class="form-group">
							<label for="recoveryEmail">Email address:</label>
							<input
								type="email"
								required
								class="form-control"
								id="recoveryEmail"
								aria-describedby="emailHelp"
								placeholder="Enter email"
								onChange={this.handleChange}
							/>
						</div>
						<button type="submit" className="btn btn-primary">
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	forgotPasswordStat: state.forgotPassword,
});

export default connect(mapStateToProps, { forgotPassword })(ForgotPassword);

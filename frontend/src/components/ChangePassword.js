import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, changePassword } from "../actions";
import {Link} from 'react-router-dom'

export class ChangePassword extends Component {
	state = {
		currentPassword: "",
		newPassword: "",
		repeatNewPassword: "",
        error: "",
        tried: false
    };
    
    componentDidMount() {
        this.props.fetchUser(localStorage.getItem("username"))
    }

	handleOldPassChange = e => {
		this.setState({ currentPassword: e.target.value });
	};

	handleNewPassChange = e => {
		this.setState({ newPassword: e.target.value });
	};

	handleRepeatNewPassChange = e => {
		this.setState({ repeatNewPassword: e.target.value });
	};

	handleSubmit = e => {
        e.preventDefault();
		if (this.state.newPassword != this.state.repeatNewPassword) {
			this.setState({error: "Confirm Your New Password"})
			return;
        }
        else{
            this.props.changePassword(this.props.user.id, this.state.currentPassword, this.state.newPassword)
            this.setState({error: '', tried: true})
        }
	};

	renderText = () => {
		if (this.state.error) {
			return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.state.error}
				</div>
			);
        }
        else if(this.state.tried && this.props.changePasswordStatus.success){
            return (
				<div className="p-3 mb-2 bg-success text-white">
					{this.props.changePasswordStatus.message}
				</div>
			);
        }
        else if(this.state.tried && !this.props.changePasswordStatus.success){
            return (
				<div className="p-3 mb-2 bg-danger text-white">
					{this.props.changePasswordStatus.message}
				</div>
			);
        }
	};

	render() {
		return (
			<div className="container">
				{this.renderText()}

				<div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="currentPassword">Old Password: </label>
							<input
								required
								value={this.state.currentPassword}
								onChange={this.handleOldPassChange}
								id="currentPassword"
								className="form-control"
								type="password"
								placeholder="Current Password"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="newPassword">New Password</label>
							<input
								required
								type="password"
								className="form-control"
								id="newPassword"
								value={this.state.newPassword}
                                onChange={this.handleNewPassChange}
                                placeholder="New Password"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="repeatNewPassword">Confirm Password</label>
							<input
								required
								type="password"
								className="form-control"
								id="repeatNewPassword"
								value={this.state.repeatNewPassword}
                                onChange={this.handleRepeatNewPassChange}
                                placeholder="Confirm Password"
							/>
						</div>
						<button type="submit" className="btn btn-primary">
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

const mapStateToProps = state => ({
	user: state.user,
	changePasswordStatus: state.changePassword,
});

export default connect(mapStateToProps, { fetchUser, changePassword })(
	ChangePassword,
);

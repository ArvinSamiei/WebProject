import React, { Component } from "react";
import { connect } from "react-redux";
import { createPost, fetchUser } from "../../actions";
import ImageUploader from "react-images-upload";
import { Link } from "react-router-dom";

class CreatePost extends Component {
	state = { title: "", text: "", picture: [] };

	componentDidMount() {
		if (!this.props.user) {
			this.props.fetchUser(localStorage.getItem("username"));
		}
	}

	titleChange = e => {
		this.setState({ title: e.target.value });
	};

	textChange = e => {
		this.setState({ text: e.target.value });
	};
	onDrop = picture => {
		this.setState({
			picture: this.state.picture.concat(picture),
		});
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.createPost(
			this.props.user.id,
			this.state.title,
			this.state.text,
			0,
			this.state.picture,
		);
	};

	render() {
		return (
			<div class="container">
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							value={this.state.title}
							className="form-control"
							id="title"
							onChange={this.titleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="posttext">Text</label>
						<textarea
							className="form-control"
							id="posttext"
							rows="10"
							value={this.state.text}
							onChange={this.textChange}
						></textarea>
					</div>
					<ImageUploader
						withIcon={true}
						buttonText="Choose Image"
						onChange={this.onDrop}
						imgExtension={[".jpg", ".gif", ".png", ".gif"]}
						maxFileSize={5242880}
						singleImage={true}
					/>
					<div class="container">
						<button type="row submit" className="btn btn-primary">
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
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => {
	if (!state.user) {
		return {
			message: state.createPost.message,
			success: state.createPost.success,
		};
	}
	return {
		user: state.user,
		message: state.createPost.message,
		success: state.createPost.success,
	};
};

export default connect(mapStateToProps, { createPost, fetchUser })(CreatePost);

import React, { Component } from "react";
import { connect } from "react-redux";
import { createPost, fetchUser, editPost, fetchPost } from "../../actions";
import ImageUploader from "react-images-upload";
import { Link, Redirect } from "react-router-dom";

class CreatePost extends Component {
	state = { title: "", text: "", picture: [], redirect: false };

	componentDidMount() {
		if (this.props.idForEdit) {
			this.props.fetchPost(this.props.idForEdit);
		}
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
		if (this.props.idForEdit) {
			this.props.editPost(
				this.props.idForEdit,
				this.state.title,
				this.state.text,
				this.state.picture,
			);
		} else {
			this.props.createPost(
				this.props.user.id,
				this.state.title,
				this.state.text,
				0,
				this.state.picture,
			);
		}
		this.setState({redirect: true})
		
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to='/'></Redirect>
		}
		if (this.state.text == "" && this.props.postText) {
			this.setState({text: this.props.postText})
		}
		if (this.state.title == "" && this.props.postTitle) {
			this.setState({title: this.props.postTitle})
		}

		if (this.state.picture == [] && this.props.image) {
			this.setState({picture: this.props.image})
		}
		return (
			<div className="container">
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							value={this.state.title || this.props.postTitle}
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
							value={this.state.text || this.props.postText}
							onChange={this.textChange}
						></textarea>
					</div>
					<ImageUploader
						withIcon={true}
						buttonText="Choose Image"
						value={this.state.picture || this.props.image}
						onChange={this.onDrop}
						imgExtension={[".jpg", ".gif", ".png", ".gif"]}
						maxFileSize={5242880}
						singleImage={true}
					/>
					<div className="container">
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

const mapStateToProps = (state, ownProps) => {
	if (!state.user) {
		return {
			message: state.createPost.message,
			success: state.createPost.success,
		};
	}
	if (state.fetchPost) {
		ownProps.postTitle = state.fetchPost.title;
		ownProps.postText = state.fetchPost.text;
		ownProps.image = state.fetchPost.image;
	}
	return {
		user: state.user,
		message: state.createPost.message,
		success: state.createPost.success,
		post: state.fetchPost,
	};
};

export default connect(mapStateToProps, {
	createPost,
	fetchUser,
	editPost,
	fetchPost,
})(CreatePost);

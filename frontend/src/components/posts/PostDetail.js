import React, { Component } from "react";
import { connect } from "react-redux";
import {
	fetchPostDetail,
	fetchUserById,
	addComment,
	like,
	dislike,
	fetchUser,
	deleteComment,
	editComment
} from "../../actions";
import "./PostDetail.css";
import { Link } from "react-router-dom";
import Modal from "react-modal";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};
Modal.setAppElement("#root");

export class PostDetail extends Component {
	state = {
		dummy: "",
		commentNo: 1,
		modalIsOpen: false,
		fromPost: false,
		caller: 0,
		text: "",
		edit: false
	};
	forPost = true;

	constructor() {
		super();
		this._isMounted = false;
		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({ modalIsOpen: true });
	}

	afterOpenModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = "#f00";
	}

	closeModal() {
		this.setState({ modalIsOpen: false });
	}
	componentDidMount() {
		this._isMounted = true;
		this.props.fetchPostDetail(this.props.id);
		this.props.fetchUser(localStorage.getItem("username"));

		this.interval = setInterval(() => {
			this.setState({ dummy: "" + "q" });
		}, 6000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	returnTarget = () => {
		return "#collapse" + this.state.commentNo;
		this.setState({ commentNo: this.state.commentNo + 1 });
	};

	returnTargetWithoutHash = target => {
		return target.substring(1);
	};

	renderOtherComments = data => {
		let result = [];
		for (let i = 0; i < data["1"].length; i++) {
			let user = this.findName(data["1"][i]["0"].creator);
			if (!user) {
				continue;
			}
			console.log("sarelareeeeee");
			let commentNo = this.state.commentNo;
			let target = this.returnTarget();
			result.push(
				<div
					style={{
						marginLeft: "50px",
						borderRadius: "10px",
						marginBottom: "10px",
						borderBottom: "1px solid",
						marginTop: "10px",
						borderLeft: "1px solid",
					}}
				>
					<li className="media">
						<Link
							className="pull-left"
							to={`/profile/${data["1"][i]["0"].creator}`}
						>
							<img
								style={{ width: "30px" }}
								className="media-object img-circle"
								src={`http://127.0.0.1:8000/users/images/${data["1"][i]["0"].creator}`}
								alt="profile"
							/>
						</Link>
						<div className="media-body">
							<div className="well well-lg">
								<h4 className="media-heading text-uppercase reviews">
									{user.first_name + " " + user.last_name}{" "}
								</h4>
								<p className="media-comment">{data["1"][i]["0"].text}</p>
								<button
									className="btn btn-success"
									onClick={e => {
										this.setState({
											fromPost: false,
											caller: data["1"][i]["0"].id,
											edit: false
										});
										this.openModal();
									}}
									id="reply"
								>
									Reply
								</button>
								{this.renderDeleteButton(data["1"][i]["0"])}
								{this.renderEditButton(data["1"][i]["0"])}
							</div>
						</div>
						{/* <div style={{ textIndent: "10px", marginLeft: "50px"  }}>
						{this.props.postDetail["1"][i]["0"].text}
						{this.renderOtherComments(this.props.postDetail["1"][i])}
					</div> */}

						{/* <p className="h2">{this.props.postDetail["1"][i]["0"].text}</p> */}
						{/* <div className="row"> */}
						{/* <div className="container">
						
					</div> */}
					</li>
					{this.renderOtherComments(data["1"][i])}
				</div>,
			);
		}
		return result;
	};
	renderImageOfPost = () => {
		if (this.props.postDetail["0"].image !== "undefined") {
			return (
				<img
					src={`http://localhost:8000/images/posts/${this.props.postDetail["0"].id}`}
					style={{ width: "350px", display: "block" }}
				></img>
			);
		} else return null;
	};

	renderDeleteButton = comment => {
		if (this.props.user.id == comment.creator) {
			return (
				<button
					style={{ marginLeft: "10px" }}
					className="btn btn-danger"
					onClick={e => {
						this.props.deleteComment(comment.id, this.props.postDetail["0"].id);
					}}
				>
					Delete
				</button>
			);
		} else {
			return null;
		}
	};

	renderEditButton = comment => {
		if (this.props.user.id == comment.creator) {
			return (
				<button
					onClick={e => {
						this.setState({
							fromPost: false,
							caller: comment.id,
							edit: true
						});
						this.openModal();
					}}
					style={{ marginLeft: "10px" }}
					className="btn btn-primary"
				>
					Edit
				</button>
			);
		} else {
			return null;
		}
	};

	renderComments = () => {
		console.log("kojayiiiiii pa");
		console.log(this.props.postDetail["1"].length);
		let result = [];
		for (let i = 0; i < this.props.postDetail["1"].length; i++) {
			let user = this.findName(this.props.postDetail["1"][i]["0"].creator);
			if (!user) {
				continue;
			}
			console.log(this.props.postDetail["1"][i]["0"]);
			let commentNo = this.state.commentNo;
			let target = this.returnTarget();

			result.push(
				<div
					style={{
						borderRadius: "10px",
						width: "100vw",
						marginBottom: "10px",
						marginTop: "10px",
						borderLeft: "1px solid",
					}}
				>
					<li className="media">
						<Link
							className="pull-left"
							to={`/profile/${this.props.postDetail["1"][i]["0"].creator}`}
						>
							<img
								style={{ width: "30px" }}
								className="media-object img-circle"
								src={`http://127.0.0.1:8000/users/images/${this.props.postDetail["1"][i]["0"].creator}`}
								alt="profile"
							/>
						</Link>
						<div className="media-body">
							<div className="well well-lg">
								<h4 className="media-heading text-uppercase reviews">
									{user.first_name + " " + user.last_name}{" "}
								</h4>
								<p className="media-comment">
									{this.props.postDetail["1"][i]["0"].text}
								</p>
								<button
									className="btn btn-success"
									onClick={e => {
										this.setState({
											fromPost: false,
											edit: false,
											caller: this.props.postDetail["1"][i]["0"].id,
										});
										this.openModal();
									}}
									id="reply"
								>
									Reply
								</button>
								{this.renderDeleteButton(this.props.postDetail["1"][i]["0"])}
								{this.renderEditButton(this.props.postDetail["1"][i]["0"])}
							</div>
						</div>
						{/* <div style={{ textIndent: "10px", marginLeft: "50px"  }}>
                    {this.props.postDetail["1"][i]["0"].text}
                    {this.renderOtherComments(this.props.postDetail["1"][i])}
                </div> */}

						{/* <p className="h2">{this.props.postDetail["1"][i]["0"].text}</p> */}
						{/* <div className="row"> */}
						{/* <div className="container">
                    
                </div> */}
					</li>
					{this.renderOtherComments(this.props.postDetail["1"][i])}
				</div>,
			);
		}
		return result;
	};

	findName = id => {
		for (let i = 0; i < this.props.userById.length; i++) {
			if (this.props.userById[i] == null) {
				continue;
			}
			// alert(this.props.userById[i].id)
			if (id == this.props.userById[i].id) {
				return this.props.userById[i];
			}
		}
	};

	getCookie = name => {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length === 2)
			return parts
				.pop()
				.split(";")
				.shift();
	};

	handleSubmit = () => {
		console.log("sakam");
		if (this.state.edit){
			this.props.editComment(this.state.caller, this.props.postDetail["0"].id, this.state.text)
		}
		this.props.addComment(
			this.props.postDetail["0"].id,
			this.state.caller,
			this.state.fromPost,
			this.getCookie("id"),
			this.state.text,
		);
	};

	textChange = e => {
		this.setState({ text: e.target.value });
	};

	render() {
		if (!this.props.postDetail) {
			return null;
		}
		console.log("khodafez");
		console.log(this.props.postDetail);
		let user = this.findName(this.props.postDetail["0"].creator_id);
		if (!user) {
			console.log("sare karee");
			return null;
		}
		return (
			<div className style={{ float: "left" }}>
				<div
					className="border border-primary rounded"
					style={{ marginBottom: "20px" }}
				>
					<Link to={`/profile/${user.id}`}>
						<img
							src={`http://127.0.0.1:8000/users/images/${user.id}`}
							style={{ width: "50px", height: "50px" }}
						/>
						<h1 style={{ display: "inline-block" }}>
							{user.first_name} {user.last_name}
						</h1>
					</Link>
					{this.renderImageOfPost()}

					<p className="h2">{this.props.postDetail["0"].title}</p>
					<br />
					<p>{this.props.postDetail["0"].text}</p>
					<img
						onClick={e => {
							this.props.like(this.props.postDetail["0"].id);
						}}
						style={{ width: "40px", cursor: "pointer" }}
						src="https://img.icons8.com/color/48/000000/filled-like.png"
					/>
					{this.props.postDetail["0"].likes}
					<img
						style={{ width: "40px", cursor: "pointer" }}
						src="https://img.icons8.com/color/64/000000/dislike.png"
						onClick={e => {
							this.props.dislike(this.props.postDetail["0"].id);
						}}
					/>
					{this.props.postDetail["0"].dislikes}
				</div>

				<ul
					style={{ border: "1px solid" }}
					className="media-list"
					id="accordion"
				>
					<h1>Comments:</h1>
					{this.renderComments()}
				</ul>
				<button
					className="btn btn-success"
					onClick={e => {
						this.setState({
							fromPost: true,
							edit: false,
							caller: this.props.postDetail["0"].id,
						});
						this.openModal();
					}}
				>
					Add A Comment
				</button>
				<Modal
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<h2
						style={{ color: "black" }}
						ref={subtitle => (this.subtitle = subtitle)}
					>
						Add A Comment
					</h2>

					<div className="Login">
						<form>
							<div className="form-group">
								<textarea
									className="form-control"
									id="replyText"
									rows="5"
									value={this.state.text}
									onChange={this.textChange}
								></textarea>
							</div>

							<button
								style={{ marginRight: "10px" }}
								type="submit"
								className="btn btn-success"
								onClick={this.handleSubmit}
							>
								Submit
							</button>
							<button className="btn btn-danger" onClick={this.closeModal}>
								Close
							</button>
						</form>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	console.log(state);
	return {
		postDetail: state.fetchPostDetail,
		userById: state.userById,
		user: state.user,
	};
};

export default connect(mapStateToProps, {
	fetchPostDetail,
	fetchUserById,
	addComment,
	like,
	dislike,
	fetchUser,
	deleteComment,
	editComment
})(PostDetail);

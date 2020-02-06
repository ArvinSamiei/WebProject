import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPostDetail, fetchUserById, addComment } from "../../actions";
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
					}}
				>
					<li className="media">
						<Link
							className="pull-left"
							to={`/profile/${data["1"][i]["0"].creator}`}
						>
							<img
								style={{ width: "50px" }}
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
								<a
									className="btn btn-info btn-circle text-uppercase"
									onClick={e => {
										this.setState({
											fromPost: false,
											caller: data["1"][i]["0"].id,
										});
										this.openModal();
									}}
									id="reply"
								>
									<span className="glyphicon glyphicon-share-alt"></span> Reply
								</a>
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
					style={{ borderRadius: "10px", width: "100vw", marginBottom: "10px" }}
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
								<a
									className="btn btn-info btn-circle text-uppercase"
									onClick={e => {
										this.setState({
											fromPost: false,
											caller: this.props.postDetail["1"][i]["0"].id,
										});
										this.openModal();
									}}
									id="reply"
								>
									<span className="glyphicon glyphicon-share-alt"></span> Reply
								</a>
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
	};
};

export default connect(mapStateToProps, {
	fetchPostDetail,
	fetchUserById,
	addComment,
})(PostDetail);

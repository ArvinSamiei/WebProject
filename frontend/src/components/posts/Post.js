import React from "react";
import { Link } from "react-router-dom";

class Post extends React.Component {
	renderImageOfPost = () => {
		if (this.props.post.fields.image !== "undefined") {
			return (
				<img
					src={`http://localhost:8000/images/posts/${this.props.post.pk}`}
					style={{ width: "350px" }}
				></img>
			);
		} else return null;
	};

	getCookie = name => {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2)
			return parts
				.pop()
				.split(";")
				.shift();
	};

	render() {
		let user = null;
		for (let i = 0; i < this.props.users.length; i++) {
			if (this.props.users[i].id == this.props.post.fields.creator_id)
				user = this.props.users[i];
		}
		if (user === null) {
			return null;
		}

		return (
			<div className="card">
				<div className="profile-header-container">
					<div className="profile-header-img">
						{/* <img className="img-rounded" src={faker.image.avatar()} /> */}
					</div>
				</div>
				<div className="card-body">
					{this.renderImageOfPost()}
					<Link className="btn btn-outline-secondary" style={{backgroundColor: 'grey'}} to={`profile/${user.id}`}>
						By: {user.first_name + " " + user.last_name}
					</Link>
					<h5 className="card-title">{this.props.post.fields.title}</h5>
					<p
						className="card-text"
						dangerouslySetInnerHTML={{
							__html: this.props.post.text,
						}}
					></p>
					<a href="#" className="btn btn-primary" style={{backgroundColor: 'blue'}}>
						View
					</a>
				</div>
			</div>
		);
	}
}

export default Post;

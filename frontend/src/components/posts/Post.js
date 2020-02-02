import React from "react";
// import faker from "faker";

class Post extends React.Component {
	renderImageOfPost = () => {
		if (this.props.post.fields.image !== "undefined") {
			return (
				<img
					src={`http://localhost:8000/images/posts/${this.props.post.pk}`}
					style={{width: '350px'}}
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
			console.log(user);
		}
		console.log("heiiiil");
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
					<h2 className="card-title">
						By: {user.first_name + " " + user.last_name}
					</h2>
					<h5 className="card-title">{this.props.post.fields.title}</h5>
					<p
						className="card-text"
						dangerouslySetInnerHTML={{
							__html: this.props.post.text,
						}}
					></p>
					<a href="#" className="btn btn-primary">
						View
					</a>
				</div>
			</div>
		);
	}
}

export default Post;
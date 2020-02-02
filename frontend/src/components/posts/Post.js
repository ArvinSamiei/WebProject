import React from "react";
import faker from "faker";

class Post extends React.Component {
	constructor() {
		super();
		this.state = { spans: 0 };
		this.refer = React.createRef();
	}

	componentDidMount() {
		console.log(this.refer);
		this.refer.current.addEventListener("load", this.setSpans);
	}

	setSpans = () => {
		const height = this.refer.current.clientHeight;
		console.log(height);
		const spans = Math.ceil(height / 10);
		this.setState({ spans: spans });
	};

	render() {
		return (
			<div
				className="card"
				style={{ gridRowEnd: `span ${this.state.spans}` }}
				ref={this.refer}
			>
				<div className="profile-header-container">
					<div className="profile-header-img">
						<img className="img-rounded" src={faker.image.avatar()} />
					</div>
				</div>
				<div className="card-body">
					<h5 className="card-title">{this.props.post.title.rendered}</h5>
					<p
						className="card-text"
						dangerouslySetInnerHTML={{
							__html: this.props.post.excerpt.rendered,
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

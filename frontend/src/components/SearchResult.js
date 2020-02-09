import React, { Component } from "react";
import { connect } from "react-redux";
import { search } from "../actions";
import searchChannels from "../reducers/searchChannels";
import { Link } from "react-router-dom";

class SearchResult extends Component {
	componentDidMount() {
		this.props.search(this.props.query);
	}

	renderUsers = () => {
		if (this.props.users) {
			return this.props.users.map(user => {
				return (
					<div>
						<Link to={`/profile/${user.pk}`}>
							{user.fields.first_name} {user.fields.last_name}
						</Link>
					</div>
				);
			});
		} else {
			return null;
		}
	};

	renderChannels = () => {
		if (this.props.channels) {
			return this.props.channels.map(channel => {
				return <div>{channel.fields.name}</div>;
			});
		} else {
			return null;
		}
	};

	renderPosts = () => {
		if (this.props.posts) {
			return this.props.posts.map(post => {
				return (
                <div>
                <Link to={`/post/${post.pk}`}>
                    {post.fields.title}
                </Link>
            </div>)
			});
		} else {
			return null;
		}
	};

	render() {
		return (
			<div>
				Users:
				{this.renderUsers()}
                <br />
				Posts:
                <br/>
				{this.renderPosts()}
				Channels:
				{this.renderChannels()}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	posts: state.searchPosts,
	channels: state.searchChannels,
	users: state.searchUsers,
});

export default connect(mapStateToProps, { search })(SearchResult);

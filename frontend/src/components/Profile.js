import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";
import {Link} from 'react-router-dom'

export class Profile extends Component {

    componentDidMount(){
        this.props.fetchUser(localStorage.getItem('username'))
    }

	render() {
        if (!this.props.user){
            return null;
        }
		return (
			<div className="row">
				<div className="col-xs-12 col-sm-6 col-md-6">
					<div className="well well-sm">
						<div className="row">
							<div className="col-sm-6 col-md-4">
								<img
									src={`http://localhost:8000/users/images/${this.props.user.username}`}
									alt=""
									className="img-rounded img-responsive"
								/>
							</div>
							<div className="col-sm-6 col-md-8">
								<h4>{`${this.props.user.first_name} ${this.props.user.last_name}`}</h4>
								<p>
									<i className="glyphicon glyphicon-envelope"></i>{this.props.user.email}
									<br />
									
								</p>
							</div>
						</div>
					</div>
                    <Link className='btn btn-primary' to='/createPost'>
                        Create Post
                    </Link>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
	};
};

export default connect(mapStateToProps, {fetchUser})(Profile);

import React, { Component } from "react";
import Header from "./Header";
import { Router, BrowserRouter, Route, Switch } from "react-router-dom";
import PostList from "./posts/PostList";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import Signup from "./Signup";
import Profile from "./Profile";
import CreatePost from "./posts/CreatePost";
import OthersProfile from "./OthersProfile";
import ChangePassword from "./ChangePassword";
import ChangeAccount from "./ChangeAccount";
import PostDetail from './posts/PostDetail'
import  ForgotPassword  from "./ForgotPassword";

export default class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Header />
					<Switch>
						<PrivateRoute exact path="/profile" component={Profile} />
						<PrivateRoute exact path="/" component={PostList} />
						<PrivateRoute path="/createPost" component={CreatePost} />
						{/* <Route
							exact
							path="/"
							render={ (props)=> (
								<div>
									<PostList {...props} />
								</div>
							)}
						/> */}
						<Route
							exact
							path="/profile/:id"
							render={props => (
								<div>
									<OthersProfile id={props.match.params.id} />
								</div>
							)}
						/>
						<Route
							exact
							path="/post/:id"
							render={props => (
								<div>
									<PostDetail id={props.match.params.id} />
								</div>
							)}
						/>
						<Route
							exact
							path="/changePassword"
							render={() => (
								<div>
									<ChangePassword />
								</div>
							)}
						/>
						<Route
							exact
							path="/forgotPassword"
							render={() => (
								<div>
									<ForgotPassword />
								</div>
							)}
						/>
						<Route
							exact
							path="/changeAccount"
							render={() => (
								<div>
									<ChangeAccount />
								</div>
							)}
						/>
						<Route
							exact
							path="/signup"
							render={() => (
								<div>
									<Signup />
								</div>
							)}
						/>
						<Route
							exact
							path="/login"
							render={() => (
								<div>
									<Login />
								</div>
							)}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

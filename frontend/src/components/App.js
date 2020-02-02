import React, { Component } from "react";
import Header from "./Header";
import { Router, BrowserRouter, Route, Switch } from "react-router-dom";
import PostList from "./PostList";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import  Signup  from "./Signup";
import Profile from './Profile'
import  CreatePost  from "./posts/CreatePost";


export default class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Header />
					<Switch>
						<PrivateRoute
							path="/profile"
							component={Profile}
						/>
						<PrivateRoute
							path="/createPost"
							component={CreatePost}
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

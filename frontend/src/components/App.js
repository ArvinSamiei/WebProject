import React, { Component } from "react";
import Header from "./Header";
import { Router, BrowserRouter, Route, Switch } from "react-router-dom";
import PostList from "./PostList";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";


export default class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Header />
					<Switch>
						<PrivateRoute
							path="/onlyAuthorizedAllowedHere/"
							component={PostList}
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

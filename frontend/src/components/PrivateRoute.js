import React from 'react'
import { connect } from "react-redux";
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {

  

  return (
    <Route
      {...rest}
      render={props =>
        props.isLoggedIn || localStorage.getItem('username') ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}


const mapStateToProps = state => ({
	isLoggedIn: state.login.success,
	isSignedup: state.signup.success,
});

export default connect(mapStateToProps)(PrivateRoute);
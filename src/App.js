import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import Dashboard from './containers/Dashboard';
import Home from './containers/Home'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import * as actionCreators from './actions/actionCreators';
import connectFirebase from './FirebaseUtils/connectFirebase'

class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<BrowserRouter>
				<div>
					<Route path="/" exact component={() => {
						return (<Home {...this.props}/>)
					}} />
					<Route path="/dashboard" component={() => {
						return (<Dashboard {...this.props}/>)
					}} />
				</div>
			</BrowserRouter>
		)
	}
}

function mapStateToProps (state) {
	return {
		isLoggedIn: state.isLoggedIn,
		authToken: state.authToken,
		currentUser: state.currentUser,
		currentUserUid: state.currentUserUid,
		currentBrandName: state.currentBrandName,
		currentBrandId: state.currentBrandId
	}
}

function mapDispatchToProps (dispatch){
	return bindActionCreators(actionCreators, dispatch);
}

export default connectFirebase(connect(mapStateToProps, mapDispatchToProps)(App))
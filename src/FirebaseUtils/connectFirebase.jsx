import React, {Component} from 'react'
import firebase from 'firebase'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreators";

const connectFirebase = (WrappedComponent) => {
	class FirebaseConnector extends Component {
		constructor(props) {
			super(props)
			this.state = {
				implementedListener: []
			}
		}

		componentDidMount() {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					this.props.login(user.displayName, user.uid)

					var firebaseBrandRef = firebase.database().ref('users/' + user.uid + '/brand')
					this.addListener(firebaseBrandRef)
					firebaseBrandRef.on('value', snapshot => {
						var brandId = Object.keys(snapshot.val())[0]
						this.props.setCurrentBrandId(brandId)

						var firebaseOngoingCodesRef = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/ongoing/codes/')
						var firebaseOffgoingCodesRef = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/offgoing/codes/')
						this.addListener(firebaseOngoingCodesRef)
						this.addListener(firebaseOffgoingCodesRef)

						firebaseOngoingCodesRef.on('value', snapshot => {
							this.props.setOngoingCodes(snapshot.val())
						})
						firebaseOffgoingCodesRef.on('value', snapshot => {
							this.props.setOffgoingCodes(snapshot.val())
						})
					})

				} else {
					this.props.logout()
				}
			})
		}

		componentWillUnmount() {
			for (let listener in this.state.implementedListener) {
				listener.off()
			}
		}

		render() {
			return(
				<WrappedComponent
					{...this.props}
				/>
			)
		}

		addListener(listener) {
			this.setState({
				implementedListener: [...this.state.implementedListener, listener]
			})
		}
	}

	function mapDispatchToProps (dispatch) {
		return bindActionCreators(actionCreators, dispatch);
	}

	return connect(null, mapDispatchToProps)(FirebaseConnector)
}

export default connectFirebase
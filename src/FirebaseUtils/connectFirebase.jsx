import React, {Component} from 'react'
import firebase from 'firebase'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreators";
import logger from "../Utils/logger";

const connectFirebase = (WrappedComponent) => {
	class FirebaseConnector extends Component {
		constructor(props) {
			super(props)
			this.state = {
				implementedListener: [], //this listener will only be turned off when the component un-mounts, i.e the app closes
			}
		}

		componentDidMount() {
			firebase.auth().onAuthStateChanged(user => {
				if (user != null) {
					logger('connectFirebase: onAuthStateChanged is fired', user)
					this.props.login(user.email, user.uid)

					var firebaseBrandRef = firebase.database().ref('users/' + user.uid + '/brand')
					this.addListener(firebaseBrandRef)
					firebaseBrandRef.on('value', snapshot => {
						var brandId = Object.keys(snapshot.val())[0]
						this.props.setCurrentBrandId(brandId)

						var firebaseBrandName = firebase.database().ref('/brands/' + brandId + '/name')
						this.addListener(firebaseBrandName)
						firebaseBrandName.on('value', snapshot => {
							logger("Brand name from firebase: ", snapshot)
							this.props.setCurrentBrandName(snapshot.val())
						})

						var firebaseOngoingCodesRef = firebase.database().ref('/brands/' + brandId + '/events/ongoing/codes/')
						var firebaseOffgoingCodesRef = firebase.database().ref('/brands/' + brandId + '/events/offgoing/codes/')
						this.addListener(firebaseOngoingCodesRef)
						this.addListener(firebaseOffgoingCodesRef)

						firebaseOngoingCodesRef.on('value', snapshot => {
							this.props.setOngoingCodes(snapshot.val())
						})
						firebaseOffgoingCodesRef.on('value', snapshot => {
							this.props.setOffgoingCodes(snapshot.val())
						})

						var firebaseCodesRef = firebase.database().ref('/brands/' + brandId + '/events/');
						this.addListener(firebaseCodesRef)
						firebaseCodesRef.on('value', snapshot => {
							this.props.setCodes(snapshot.val())
						})

						var firebaseAccessibleMachines = firebase.database().ref('/brands/' + brandId + '/machines')
						this.addListener(firebaseAccessibleMachines)

						firebaseAccessibleMachines.on('value', snapshot => {
							Object.keys(snapshot.val()).map(machineId => {
								let firebaseMachineRef = firebase.database().ref('/machines/' + machineId)
								this.addListener(firebaseMachineRef)
								firebaseMachineRef.on('value', snapshot => {
									logger("Iterating through accessible machines ", machineId)
									this.props.updateMachinesData(machineId, snapshot.val())
								})
							})
						})
					})

				} else {
					this.props.logout()
					logger("connectFirebase: number of implemented listener: ", this.state.implementedListener.length)
					for (let i = 0; i < this.state.implementedListener.length; i++) {
						logger('Iterating through implemented listener', this.state.implementedListener[i])
						this.state.implementedListener[i].off()
					}
					this.setState({
						implementedListener: []
					})
				}
			})
		}

		componentWillUnmount() {
			this.props.logout()
			logger("connectFirebase: number of implemented listener: ", this.state.implementedListener.length)
			for (let i = 0; i < this.state.implementedListener.length; i++) {
				logger('Iterating through implemented listener', this.state.implementedListener[i])
				this.state.implementedListener[i].off()
			}
			this.setState({
				implementedListener: []
			})
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
import React, {Component} from 'react'
import firebase from 'firebase'

const bindFirebaseBrand = (WrappedComponent) => {
	return class extends Component {
		constructor(props) {
			super(props)
			this.state = {
				firebaseCodesOffgoing: null,
				firebaseCodesOngoing: null
			}
		}

		componentWillMount() {
			var firebaseRefOngoing = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/ongoing/codes/')
			var firebaseRefOffgoing = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/offgoing/codes/')

			firebaseRefOngoing.on('value', snapshot => {
				console.log("bindFirebaseBrand")
				console.log(snapshot.val())
				this.setState({
					firebaseCodesOngoing: snapshot.val()
				})
			})

			firebaseRefOffgoing.on('value', snapshot => {
				this.setState({
					firebaseCodesOffgoing: snapshot.val()
				})
			})
		}

		componentWillUnmount() {
			var firebaseRefOngoing = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/ongoing/codes/')
			var firebaseRefOffgoing = firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/offgoing/codes/')

			firebaseRefOngoing.off()
			firebaseRefOffgoing.off()
		}

		render() {
			return(
				<WrappedComponent
					firebaseCodesOffgoing={this.state.firebaseCodesOffgoing}
					firebaseCodesOngoing={this.state.firebaseCodesOngoing}
					{...this.props}
				/>
			)
		}
	}
}

export default bindFirebaseBrand
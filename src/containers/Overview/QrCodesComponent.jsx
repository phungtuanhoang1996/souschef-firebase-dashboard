import React from 'react';
import MachinesCardComponent from './components/MachinesCardComponent';
import CodeCardComponent from './components/CodeCardComponent';
import './QrCodesComponent.css';
import {
	Card,
	CardHeader,
	Col,
	Row
} from 'reactstrap';
import {styled} from 'styled-components';
import {connect} from 'react-redux'
import CodeModificationModal from './components/CodeModificationModal'
import NewCodeModal from './components/NewCodeModal'
import logger from "../../Utils/logger";

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId,
		ongoingCodes: state.ongoingCodes,
		offgoingCodes: state.offgoingCodes,
		machinesData: state.machinesData
	}
}

class QrCodesComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			event: 'ongoing',
			newCodeModal: false,
			newCodeModalDetails: null,
			codeModificationModal: false,
			codeModificationDetails: null
		}
	}

	/*
		returns object of online / offline machines from an object of mixed
	 */
	getMachines = (machinesObject, option) => {
		let sortedMachines = {}

		Object.keys(machinesObject).map(key => {
			if (machinesObject[key]['online'] && option === 'online') {
				sortedMachines[key] = machinesObject[key]
			} else if (!machinesObject[key]['online'] && option === 'offline') {
				sortedMachines[key] = machinesObject[key]
			}
		})

		logger(option + 'sorted machines', sortedMachines)
		return sortedMachines
	}

	showCodeModificationModal = (code, startDate, endDate, useCount) => {
		console.log('modification modal for ' + code + ' is shown')
		var currentBrandId = this.props.currentBrandId
		var eventType = this.state.event
		this.setState({
			codeModificationModal: true,
			codeModificationDetails: {
				code,
				startDate,
				endDate,
				useCount,
				currentBrandId,
				eventType
			}
		})
	}

	showNewCodeModal = () => {
		var currentBrandId = this.props.currentBrandId
		var eventType = this.state.event
		this.setState({
			newCodeModal: true,
			newCodeModalDetails: {
				currentBrandId,
				eventType
			}
		})
	}

	toggleCodeModificationModal = () => {
		this.setState({
			codeModificationModal: !this.state.codeModificationModal,
			codeModificationDetails: null
		})
	}

	toggleNewCodeModal = () => {
		this.setState({
			newCodeModal: !this.state.newCodeModal,
		})
	}

	render() {
		return (
			<div className="qrCodesWrapper">
				<div className="codeCardComponent">
					<CodeCardComponent
						firebaseOngoingCodes={this.props.ongoingCodes}
						firebaseOffgoingCodes={this.props.offgoingCodes}
						onModifyButtonClicked={this.showCodeModificationModal}
						onNewCodeButtonClicked={this.showNewCodeModal}
					/>
				</div>
				<CodeModificationModal
					isOpen={this.state.codeModificationModal}
					toggle={this.toggleCodeModificationModal}
					details={this.state.codeModificationDetails}
				/>
				<NewCodeModal
					isOpen={this.state.newCodeModal}
					toggle={this.toggleNewCodeModal}
					details={this.state.newCodeModalDetails}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps, null)(QrCodesComponent)

import React from 'react';
import MachinesCardComponent from './components/MachinesCardComponent';
import CodeCardComponent from './components/CodeCardComponent';
import './OverviewComponent.css';
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

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId,
		ongoingCodes: state.ongoingCodes,
		offgoingCodes: state.offgoingCodes
	}
}

class OverviewComponent extends React.Component {
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

	render() {
		console.log("Overview component re-rendered")
		console.log(this.props)
		return (
			<div className="overviewWrapper">
				<div className="machinesCardComponent">
					<Card>
						<CardHeader>Machines</CardHeader>
						<Row>
							<Col sm="6">
								<MachinesCardComponent title="Online" machines={this.props.onlineMachines}/>
							</Col>
							<Col sm="6">
								<MachinesCardComponent title="Offline" machines={this.props.offlineMachines}/>
							</Col>
						</Row>
					</Card>
				</div>
				<div className="codeCardComponent">
					<CodeCardComponent
						selectedEvent={this.state.event}
						changeSelectedEvent={this.changeSelectedEvent}
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
		);
	}

	changeSelectedEvent = (event) => {
		console.log('changeSelectedEvent: clicked on ' + event)
		this.setState({
			event: event
		})
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
}

export default connect(mapStateToProps, null)(OverviewComponent)
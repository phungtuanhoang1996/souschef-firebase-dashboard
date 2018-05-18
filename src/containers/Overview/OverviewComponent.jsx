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

const mapStateToProps = (state) => {
	console.log('state is')
	console.log(state)

	return {
		currentBrandId: state.currentBrandId,
		firebase: state.firebase
	}
}

class OverviewComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			event: 'ongoing',
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
				<div class="codeCardComponent">
					<CodeCardComponent
						selectedEvent={this.state.event}
						changeSelectedEvent={this.changeSelectedEvent}
						codes={this.props.codes}
						onModifyButtonClicked={this.showCodeModificationModal}/>
				</div>
				<CodeModificationModal
					isOpen={this.state.codeModificationModal}
					toggle={this.toggle}
					details={this.state.codeModificationDetails}
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

	toggle = () => {
		this.setState({
			codeModificationModal: !this.state.codeModificationModal,
			codeModificationDetails: null
		})
	}
}

export default connect(mapStateToProps, null)(OverviewComponent)
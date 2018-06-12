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
import logger from "../../Utils/logger";
import { Segment } from 'semantic-ui-react'

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId,
		ongoingCodes: state.ongoingCodes,
		offgoingCodes: state.offgoingCodes,
		machinesData: state.machinesData
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

	render() {
		return (
			<div className="overviewWrapper">
				<div style={{
					display: 'flex',
					height: '40vh',
					margin: '0px',
					padding: '5px',
					paddingBottom: '2px'
				}}>
					<Segment raised style={{
						flex: '1',
						margin: '0px',
						padding: '0px',
						display: 'flex',
						flexDirection: 'column'
					}}>
						<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>Machines Status</h2>
						<div style={{
							flex: '1',
							margin: '0px',
							display: 'flex'
						}}>
							<div style={{
								flex: '1', display: 'flex'
							}}>
								<MachinesCardComponent title="online" machines={this.getMachines(this.props.machinesData, 'online')}/>
							</div>
							<div style={{
								flex: '1'
							}}>
								<MachinesCardComponent title="offline" machines={this.getMachines(this.props.machinesData, 'offline')}/>
							</div>
						</div>
					</Segment>
				</div>
				<div style={{
					display: 'flex',
					height: '60vh',
					margin: '0px',
					padding: '5px',
					paddingTop: '3px'}}>
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
		);
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
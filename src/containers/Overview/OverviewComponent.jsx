import React from 'react';
import MachinesCardComponent from './components/MachinesCardComponent';
import CodeCardComponent from './components/CodeCardComponent';
import './OverviewComponent.css';
import {styled} from 'styled-components';
import {connect} from 'react-redux'
import logger from "../../Utils/logger";
import { Segment } from 'semantic-ui-react'

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId,
		ongoingCodes: state.ongoingCodes,
		offgoingCodes: state.offgoingCodes,
		machinesData: state.machinesData,
		selectedEvent: state.currentEvent,
		codes: state.codes
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

		//logger(option + 'sorted machines', sortedMachines)
		return sortedMachines
	}

	render() {
		return (
			<div className="overviewWrapper">
				<div style={{
					display: 'flex',
					height: '40vh',
					margin: '0px',
					padding: '10px',
					paddingBottom: '5px'
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
					padding: '10px',
					paddingTop: '5px'}}>
					<CodeCardComponent
						firebaseOngoingCodes={this.props.ongoingCodes}
						firebaseOffgoingCodes={this.props.offgoingCodes}
						currentBrandId={this.props.currentBrandId}
						codes={this.props.codes}
						selectedEvent={this.props.selectedEvent}
					/>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, null)(OverviewComponent)
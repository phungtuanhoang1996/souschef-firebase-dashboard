import React, {Component} from 'react';
import logger from "../../../Utils/logger";
import { Segment, Table, Button, Input, Dropdown, Modal } from 'semantic-ui-react'
import qrScanIcon from '../../../resources/icons/qr-scan.png'
import QrReader from 'react-qr-reader'
import CodeModificationModal from "./CodeModificationModal";
import NewCodeModal from "./NewCodeModal";
import SelectEventModal from "./SelectEventModal"

export default class CodeCardComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filterKeyword: '',
			codeModificationModal: false,
			newCodeModal: false,
			qrScanner: false,
			selectEventModal: false
		}
	}

	codesTypeTobeShown = () => {
		if (this.props.codes[this.props.selectedEvent]) return this.filterCode(this.props.codes[this.props.selectedEvent]['codes'], this.state.filterKeyword)
		else return {}
	}

	totalCodesCount = () => (!this.props.codes || !this.props.selectedEvent) ? 0 : Object.keys(this.props.codes[this.props.selectedEvent]['codes']).length

	changeSelectedEvent = (event) => {
		this.setState({
			selectedEvent: event
		})
	}

	handleFilterKeywordChange = (event) => {
		this.setState({
			filterKeyword: event.target.value
		})
	}

	filterCode = (codes, keyword) => {
		if (keyword === '' || !keyword) return codes

		var filteredCodes = {}

		Object.keys(codes).map(key => {
			if (key.startsWith(keyword)) filteredCodes[key] = codes[key]
		})

		return filteredCodes
	}

	toggleQR = () => {
		this.setState({
			qrScanner: !this.state.qrScanner
		})
	}

	openQR = () => {
		this.setState({
			qrScanner: true
		})
	}

	closeQr = () => {
		this.setState({
			qrScanner: false
		})
	}

	handleQrResult = (result) => {
		if (result != null) {
			this.setState({
				filterKeyword: result,
				qrScanner: false
			})
		}
	}

	showCodeModificationModal = (code, startDate, endDate, useCount) => {
		var currentBrandId = this.props.currentBrandId
		var eventType = this.props.selectedEvent
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
		logger('modification modal for ' + code + ' is shown', {
			code,
			startDate,
			endDate,
			useCount,
			currentBrandId,
			eventType
		})
	}

	closeCodeModificationModal = () => {
		this.setState({
			codeModificationModal: false,
			codeModificationDetails: null
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

	closeNewCodeModal = () => {
		this.setState({
			newCodeModal: false,
		})
	}

	onNewCodeButtonCLick = () => {
		this.setState({
			newCodeModal: true
		})
	}

	openSelectEventModal = () => {
		this.setState({
			selectEventModal: true
		})
	}

	closeSelectEventModal = () => {
		this.setState({
			selectEventModal: false
		})
	}

	render() {
		return (
			<Segment raised style={{
				flex: '1',
				margin: '0px',
				padding: '0px',
				display: 'flex',
				flexDirection: 'column'
			}}>
				{
					!this.props.codes || !this.props.selectedEvent
						?
							(
								<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>
									Event Codes: Loading...
								</h2>
							)
						:
							(
								<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>
									Event Codes: {this.totalCodesCount()} code{this.totalCodesCount() > 1 ? 's' : null} registered
									for current event - {this.props.selectedEvent}
								</h2>
							)
				}
				<div style={{flex: '1', paddingLeft: '20px', paddingRight: '20px', display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', width: "100%", flex: 'none'}}>
						<Button
							color="teal"
							onClick={this.openSelectEventModal}
							style={{marginRight: '5px'}}
						>Change event</Button>
						<Button onClick={this.openQR} size='medium'>
							<div style={{display: 'table'}}>
								<img src={qrScanIcon} alt='qr scan icon' width='25' height='25' style={{marginRight: '5px'}}/>
								<div style={{display: 'table-cell', verticalAlign: 'middle'}}>QR Scanner</div>
							</div>
						</Button>
						<Input
							value={this.state.filterKeyword}
							onChange={(event) => {
								this.handleFilterKeywordChange(event)
							}}
							placeholder="Type here to filter QR codes..."
							style={{flex: '1', marginLeft: '5px', marginRight: '5px'}}
						/>
						<Button
							color='teal'
							onClick={this.onNewCodeButtonCLick}
							style={{marginLeft: '5px'}}>Add a new code
						</Button>
					</div>

					<div style={{marginTop: '5px', marginBottom: '0px', flex: 'none', overflowY: 'scroll'}}>
						<Table celled striped>
							<Table.Header style={{flex: 'none'}}>
								<Table.HeaderCell textAlign='center' style={{width: '40%', backgroundColor: '#C2D4EA'}}>Code</Table.HeaderCell>
								<Table.HeaderCell textAlign='center' style={{width: '15%', backgroundColor: '#C2D4EA'}}>Uses Left</Table.HeaderCell>
								<Table.HeaderCell textAlign='center' style={{width: '15%', backgroundColor: '#C2D4EA'}}>Start Date</Table.HeaderCell>
								<Table.HeaderCell textAlign='center' style={{width: '15%', backgroundColor: '#C2D4EA'}}>End Date</Table.HeaderCell>
								<Table.HeaderCell textAlign='center' style={{width: '15%', backgroundColor: '#C2D4EA'   }}>Action</Table.HeaderCell>
							</Table.Header>
						</Table>
					</div>

					<div style={{flex: 'auto', height: '100px', overflowY: 'scroll', marginTop: '0px', marginBottom: '10px'}}>
						<Table celled striped>
							<Table.Body>
								{
									Object.keys(this.codesTypeTobeShown()).map((code) => {
										return (
											<Table.Row>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '40%', paddingTop: '5px', paddingBottom: '5px'}}>{code}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%', paddingTop: '5px', paddingBottom: '5px'}}>{this.codesTypeTobeShown()[code].start_date != "" ? this.codesTypeTobeShown()[code].start_date : "N/A"}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%', paddingTop: '5px', paddingBottom: '5px'}}>{this.codesTypeTobeShown()[code].end_date != "" ? this.codesTypeTobeShown()[code].end_date : "N/A"}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%', paddingTop: '5px', paddingBottom: '5px'}}>{this.codesTypeTobeShown()[code].use_count}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%', paddingTop: '5px', paddingBottom: '5px'}}>
													<Button size='small' onClick={() => {
														this.showCodeModificationModal(code,
															this.codesTypeTobeShown()[code].start_date,
															this.codesTypeTobeShown()[code].end_date,
															this.codesTypeTobeShown()[code].use_count
														)
													}
													}
													>
														Modify
													</Button>
												</Table.Cell>
											</Table.Row>
										)
									})
								}
							</Table.Body>
						</Table>
					</div>
				</div>
				<Modal closeIcon dimmer='blurring' size='mini' open={this.state.qrScanner} onClose={this.closeQr}>
					<Modal.Header>QR code scanner</Modal.Header>
					<Modal.Content>
						<QrReader
							delay={500}
							onError={(error) => {logger('QR error', error)}}
							onScan={(result) => this.handleQrResult(result)}
							style={{margin: '5px'}}
						/>
					</Modal.Content>
				</Modal>

				<CodeModificationModal
					isOpen={this.state.codeModificationModal}
					close={this.closeCodeModificationModal}
					details={this.state.codeModificationDetails}
				/>

				<NewCodeModal
					isOpen={this.state.newCodeModal}
					close={this.closeNewCodeModal}
					currentBrandId={this.props.currentBrandId}
					eventType={this.props.selectedEvent}
				/>

				<SelectEventModal
					open={this.state.selectEventModal}
					onClose={this.closeSelectEventModal}
				/>
			</Segment>
		)
	}
}
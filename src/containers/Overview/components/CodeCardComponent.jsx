import React, {Component} from 'react';
import logger from "../../../Utils/logger";
import { Segment, Table, Button, Input, Icon, Modal } from 'semantic-ui-react'
import qrScanIcon from '../../../resources/icons/qr-scan.png'
import QrReader from 'react-qr-reader'
import CodeModificationModal from "./CodeModificationModal";
import NewCodeModal from "./NewCodeModal";

export default class CodeCardComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedEvent: 'ongoing',
			filterKeyword: '',
			codeModificationModal: false,
			newCodeModal: false,
			qrScanner: false
		}
	}

	codesTypeTobeShown = () => {
		if (this.state.selectedEvent === 'ongoing') return this.filterCode(this.props.firebaseOngoingCodes, this.state.filterKeyword)
		else if (this.state.selectedEvent === 'offgoing') return this.filterCode(this.props.firebaseOffgoingCodes, this.state.filterKeyword)
		else return {}
	}

	totalCodesCount = () => (!this.props.firebaseOffgoingCodes || !this.props.firebaseOngoingCodes) ? 0 : Object.keys(this.props.firebaseOngoingCodes).length + Object.keys(this.props.firebaseOffgoingCodes).length

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
		var eventType = this.state.selectedEvent
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

	toggleNewCodeModal = () => {
		this.setState({
			newCodeModal: !this.state.newCodeModal,
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
				<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>
					Event Codes: {this.totalCodesCount()} code{this.totalCodesCount() > 2 ? 's' : null} registered
				</h2>
				<div style={{flex: '1', paddingLeft: '20px', paddingRight: '20px', display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', width: "100%", flex: 'none'}}>
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
							onClick={() => {
								this.props.onNewCodeButtonClicked()
							}}
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

					<div style={{flex: 'auto', overflowY: 'scroll', marginTop: '0px', marginBottom: '10px'}}>
						<Table celled striped>
							<Table.Body>
								{
									Object.keys(this.codesTypeTobeShown()).map((code) => {
										return (
											<Table.Row>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '40%'}}>{code}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%'}}>{this.codesTypeTobeShown()[code].start_date != "" ? this.codesTypeTobeShown()[code].start_date : "N/A"}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%'}}>{this.codesTypeTobeShown()[code].end_date != "" ? this.codesTypeTobeShown()[code].end_date : "N/A"}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%'}}>{this.codesTypeTobeShown()[code].use_count}</Table.Cell>
												<Table.Cell textAlign='center' verticalAlign='middle' style={{width: '15%'}}>
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
					toggle={this.toggleNewCodeModal}
					details={this.state.newCodeModalDetails}
				/>

			</Segment>
		)
	}
}

const styles = {
	tableData: {
		verticalAlign: "middle",
		verticalAlign: "middle",
	},
	modifyButtonCell: {
		textAlign: "center"
	}
}
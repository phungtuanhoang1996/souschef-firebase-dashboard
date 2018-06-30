import firebase from 'firebase'
import React from 'react'
import Dropzone from 'react-dropzone'
import logger from '../../../Utils/logger'
import Papa from 'papaparse'
import XLSX from 'xlsx'
import moment from "moment/moment";
import {Modal, Button, Image, Progress, Dropdown} from 'semantic-ui-react'
import xlsxExample from '../../../resources/images/xlsx-example.png'
import xlsxIcon from '../../../resources/icons/xls-icon.svg'
import {connect} from "react-redux";

class ImportXlsxModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentStage: 'INTRO', // INTRO -> CHOOSE_FILE -> PARSE_AND_UPLOAD
			uploadedFile: null,
			status: 'STANDBY', // STANDBY -> PARSING -> UPLOADING -> DONE
			errorType: null,
			errorDetails: null,
			uploadingEvent: this.props.currentEvent
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.isOpen && !nextProps.isOpen) {
			logger('componentWillReceiveProps is fired')
			this.setState({
				currentStage: 'INTRO', // INTRO -> CHOOSE_FILE -> PARSE_AND_UPLOAD
				uploadedFile: null,
				status: 'STANDBY', // STANDBY -> PARSING -> UPLOADING -> DONE
				errorType: null,
				errorDetails: null,
				uploadingEvent: this.props.currentEvent
			})
		}
	}

	next = () => {
		let nextStage

		if (this.state.currentStage === 'INTRO') nextStage = 'CHOOSE_FILE'
		if (this.state.currentStage === 'CHOOSE_FILE') nextStage = 'PARSE_AND_UPLOAD'
		if (this.state.currentStage === 'PARSE_AND_UPLOAD') return

		this.setState({
			currentStage: nextStage
		})
	}

	previous = () => {
		let lastStage

		if (this.state.currentStage === 'INTRO') return
		if (this.state.currentStage === 'CHOOSE_FILE') lastStage = 'INTRO'
		if (this.state.currentStage === 'PARSE_AND_UPLOAD') lastStage = 'CHOOSE_FILE'
		this.setState({
			currentStage: lastStage
		})
	}

	getCurrentStage = () => {
		switch (this.state.currentStage) {
			case 'INTRO': {
				return (
					<div style={{
						display: 'table'
					}}>
						<Image src={xlsxExample} rounded bordered alt='example' style={{height: '27vmin', objectFit: 'contain'}}>
						</Image>

						<div style={{display: 'table-cell', padding:'auto', paddingLeft: '20px', verticalAlign: 'middle', textAlign: 'left'}}>
							<h3>Before you upload an Excel file...</h3>
							<div className="ui list">
								<a className="item">
									<i className="right triangle icon"></i>
									<div className="content">
										<div className="description">All codes should be in a sheet named <b>"codes"</b></div>
									</div>
								</a>

								<a className="item">
									<i className="right triangle icon"></i>
									<div className="content">
										<div className="description">Each row in the Excel sheet must have 4 cells in the following order:</div>
										<div className="description"><b>QR - Start Date - End Date - Use Count</b></div>
									</div>
								</a>

								<a className="item">
									<i className="right triangle icon"></i>
									<div className="content">
										<div className="description">QR cannot contain ".", "#", "$", "[", or "]"</div>
									</div>
								</a>

								<a className="item">
									<i className="right triangle icon"></i>
									<div className="content">
										<div className="description">Start and end dates must be in DD/MM/YYYY</div>
									</div>
								</a>

								<a className="item">
									<i className="right triangle icon"></i>
									<div className="content">
										<div className="description">Use count must be a positive number</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				)
			}
			case 'CHOOSE_FILE': {
				return (
					<div style={{display: 'table', margin: 'auto'}}>
						<div style={{display: 'table-cell'}}>
							<Dropzone onDrop={this.onDrop}>
								<img src={xlsxIcon} alt='xlsx icon' style={{height: '200px', objectFit: 'contain', padding: '50px'}}/>
							</Dropzone>
						</div>
						<div style={{display: 'table-cell', padding: 'auto', paddingLeft: '20px', verticalAlign: 'middle', textAlign: 'left'}}>
							<h3 style={{padding: '0px'}}>Drag a .XLS / .XLSX file into the box or click to choose a file to upload</h3>
							<p style={{padding: '0px'}}>Uploaded file: {this.state.uploadedFile === null ? 'None' : this.state.uploadedFile.name}</p>
							<br/>
							<p>
								<span>
									{"Upload to the following event: "}
									<Dropdown inline text={this.state.uploadingEvent}>
										<Dropdown.Menu>
											{
												this.props.events.map(event => {
													return (
														<Dropdown.Item onClick={() => {this.setState({uploadingEvent: event})}}>
															{event}
														</Dropdown.Item>
													)
												})
											}
										</Dropdown.Menu>
									</Dropdown>
								</span>
							</p>
						</div>
					</div>
				)
			}
			case 'PARSE_AND_UPLOAD': {
				let status = this.state.status
				let errorType = this.state.errorType
				return (
					<div style={{height: '100%'}}>
						{/* Loader*/}
						{status !== 'DONE'
							? (
								<div className="ui active inverted dimmer" style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
									<div className="ui active centered text inline loader">
										{status === 'PARSING' ? 'Parsing': null}
										{status === 'UPLOADING' ? 'Uploading' : null}
									</div>
								</div>
							)
							: null
						}

						{/*/!* Status under progress bar *!/*/}
						{/*<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>*/}
							{/*{status === 'PARSING' ? <p>Parsing...</p> : null}*/}
							{/*{status === 'UPLOADING' ? <p>Uploading...</p> : null}*/}
							{/*{status === 'DONE' && errorType === null ? <p>Done!</p> : null}*/}
							{/*{status === 'DONE' && errorType !== null ? <p>Done with errors</p> : null}*/}
						{/*</div>*/}

						{/* Details */}
						<div style={{display: 'table', height: '100%'}}>
							{status === 'DONE' && !errorType ? <p>Successful uploaded all codes</p> : null}
							{status === 'DONE' && errorType === 'INVALID_DATA_EXISTS'
								? (
									<div style={{display: 'table-cell', textAlign:' center', verticalAlign: 'middle'}}>
										<h4>{"Uploaded " + this.state.errorDetails.valid + " codes"}</h4>
										<h4>{this.state.errorDetails.invalid +
										" row" +
										(this.state.errorDetails.invalid > 1 ? 's were' : ' was') + " invalid"}</h4>									</div>
								) : null
							}
							{status === 'DONE' && errorType && errorType !== 'INVALID_DATA_EXISTS'
								? <p>{this.state.errorDetails}</p> : null
							}
						</div>
					</div>
				)
			}
		}
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		logger('Dropzone', acceptedFiles)
		this.setState({
			uploadedFile: acceptedFiles[0]
		})
	}

	parseAndUpload = () => {
		var reader = new FileReader()

		reader.onload = (e) => {
			this.setState({
				status: 'PARSING'
			})

			var workbook
			try {
				workbook = XLSX.read(reader.result, {type: 'array'})
			} catch (e) {
				this.setState({
					status: 'DONE',
					errorType: 'READ_SHEET_FAIL',
					errorDetails: 'Failed to read Excel file'
				})
				return
			}

			var csvString
			try{
				csvString = XLSX.utils.sheet_to_csv(workbook.Sheets['codes'])
			} catch (e) {
				this.setState({
					status: 'DONE',
					errorType: 'NO_CODE_SHEET',
					errorDetails: "Failed to find a 'codes' sheet"
				})
				return
			}
			Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets['codes']), {
				complete: results => {
					this.setState({
						status: 'UPLOADING'
					})

					logger("papaparse results", results)

					let firebaseUploadData = {}

					var validRows = 0
					var invalidRows = 0

					Object.keys(results.data).map(key => {
						let code = results.data[key][0]
						let startDate = results.data[key][1]
						let endDate = results.data[key][2]
						let useCount = parseInt(results.data[key][3])

						var validationResult = this.validateInput(code, startDate, endDate, useCount)

						if (validationResult.isValid) {
							firebaseUploadData[code] = {
								start_date: startDate,
								end_date: endDate,
								use_count: useCount
							}
							validRows++
						} else {
							invalidRows++
						}
					})

					logger('firebase data upload object', firebaseUploadData)

					firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/' + this.state.uploadingEvent + '/codes').update(
						firebaseUploadData
					).then(success => {
						if (invalidRows === 0) {
							this.setState({
								status: 'DONE'
							})
						} else {
							this.setState({
								status: 'DONE',
								errorType: 'INVALID_DATA_EXISTS',
								errorDetails: {
									invalid: invalidRows,
									valid: validRows
								}
							})
						}
						logger('parsed and uploaded to firebase')
					}, error => {
						logger('failed to parse and upload to firebase', error.message)
					})
				}
			})
		}

		reader.readAsArrayBuffer(this.state.uploadedFile)
	}

	getNextButton = () =>{
		switch (this.state.currentStage) {
			case 'INTRO': return (
				<Button color="blue" onClick={this.next}>Next</Button>
			)
			case 'CHOOSE_FILE': return (
				<Button color={this.state.uploadedFile !== null ? 'green' : ''}
				        onClick={() => {
							if (this.state.uploadedFile !== null) this.next()
							this.parseAndUpload()
						}}
				        disabled={this.state.uploadedFile === null}
				>Upload</Button>
			)
			case 'PARSE_AND_UPLOAD': return (
				<Button onClick={this.props.close}>Close</Button>
			)
			default: return (
				<Button color="primary" onClick={this.next}>Next</Button>
			)
		}
	}

	getPreviousButton = () => {
		switch (this.state.currentStage) {
			case 'INTRO': return null
			case 'CHOOSE_FILE': return (
				<Button onClick={() => {
					this.previous()
					this.setState({
						uploadedFile: null
					})
				}}>Back</Button>
			)
			case 'PARSE_AND_UPLOAD': return (
				<Button color="blue" onClick={() => {
					this.previous()
					this.setState({
						uploadedFile: null,
						status: ''
					})
				}}>Import another</Button>
			)
			default: return (
				<Button onClick={this.next}>Next</Button>
			)
		}
	}

	validateInput = (code, _startDate, _endDate, useCount) => {
		//initial state check
		var validationResult = {
			isValid: true
		}

		if (!code || !_startDate || !_endDate || !useCount) {
			console.log("Input is validated -> uninitialized")
			validationResult = {
				...validationResult, missingFields: true, isValid: false
			}
			return validationResult
		}

		//check start/end date format
		//check end date is after start date
		var startDate = moment(_startDate, "DD/MM/YYYY", true)
		var endDate = moment(_endDate, "DD/MM/YYYY", true)

		if (!startDate.isValid() || !endDate.isValid()) {
			console.log("Input is validated -> dates format wrong")
			validationResult = {
				...validationResult, datesFormatWrong: true, isValid: false
			}
		} else if (endDate.isBefore(startDate)) {
			console.log("Input is validated -> end before start")
			validationResult = {
				...validationResult, startDateAfterEndDate: true, isValid: false
			}
		}

		//check use count
		if (!Number.isInteger(useCount) || useCount < 0) {
			console.log("Input is validated -> use count format wrong")
			validationResult = {
				...validationResult, useCountWrongFormat: true, isValid: false
			}
		}

		// check if QR contains illegal characters
		// Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
		if (code.includes('.') || code.includes('#')
			|| code.includes('$') || code.includes('[')
			|| code.includes(']') || code === '') {
			console.log("Input is validated -> illegal characters in code")
			validationResult = {
				...validationResult, codeIllegalChar: true, isValid: false
			}
		}

		console.log('At the end of validity check: isValid is ' + validationResult.isValid)
		return validationResult
	}

	render() {
		logger('xlsx modal state', this.state)
		return (
			<Modal
				dimmer='blurring'
				open={this.props.isOpen}
				closeIcon onClose={this.props.close}
			>
				<Modal.Header>Bulk import from Excel sheet</Modal.Header>
				<Modal.Content align='center' style={{height: '33vh', width: '50vw', margin: 'auto'}}>
					{this.getCurrentStage()}
				</Modal.Content>
				<Modal.Actions>
					{this.getPreviousButton()}
					{this.getNextButton()}
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		events: Object.keys(state.codes),
		currentEvent: state.currentEvent
	}
}

export default connect(mapStateToProps, null)(ImportXlsxModal)
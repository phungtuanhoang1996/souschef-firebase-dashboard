import React from 'react'
import {Modal, Input, Button, Segment, Divider, Step, Icon} from 'semantic-ui-react'
import firebase from 'firebase'
import Dropzone from 'react-dropzone'
import logger from "../../../Utils/logger";
import Papa from "papaparse";
import moment from "moment/moment";
import XLSX from 'xlsx'

class NewEventModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			step: 'event name',
			eventName: '',
			uploadedFile: null,
			isDropzoneEnabled: true,
			parsingResult: null,
			eventData: null,
			eventNameError: ''
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.open !== nextProps.open) {
			//logger('componentWillReceiveProps is fired')
			this.setState({
				step: 'event name',
				eventName: '',
				uploadedFile: null,
				isDropzoneEnabled: true,
				parsingResult: null,
				eventData: null,
				eventNameError: ''
			})
		}
	}

	getModalContent = (step) => {
		switch (step) {
			case 'event name': {
				return (
					<div>
						<h3>Enter the name of the event</h3>
						<Input
							value={this.state.eventName}
							onChange={this.onEventNameInputChange}
							error={this.state.eventNameError === 'Event name must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"' }
						/>
						{
							this.state.eventNameError === 'Event name must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"'
							?
								(
									<div style={{color: '#CE201E', marginTop: '10px'}}>{this.state.eventNameError}</div>
								)
							:
								(
									<div style={{color: '#CE201E', marginTop: '10px'}}>
										<br/>
									</div>
								)
						}
					</div>
				)
			}
			case 'upload codes': {
				return (
					<div>
						<h3>Import code from a .XLSX / .CSV file for the event</h3>
						<span style={{display: 'inline-flex'}}>
							<div>
								<Dropzone onDrop={this.onFileDrop} disabled={!this.state.isDropzoneEnabled}>
								</Dropzone>
							</div>
							<div>
								{
									this.state.uploadedFile ? (
										<div>
											<br/>Uploaded file: {this.state.uploadedFile.name}
										</div>
									) : (
										<div>
											<br/>Uploaded file: None
										</div>
									)
								}

							<br/>

								{
									this.state.parsingResult ? (
										<div>{this.state.parsingResult}</div>
									) : (
										<div><br/></div>
									)
								}
							</div>
						</span>
					</div>
				)
			}
		}
	}

	getNextButton = (step) => {
		switch (step) {
			case 'event name': {
				return (
					<Button color={'blue'}
					     onClick={() => this.setState({step: 'upload codes'})}
					        disabled={this.state.eventNameError !== null}
					>Next
					</Button>
				)
			}
			case 'upload codes': {
				return (
					<Button color={'blue'}
						onClick={() => this.setState({step: 'confirmation'})}
					>Next
					</Button>
				)
			}
			case 'confirmation': {
				return (
					<Button color={'green'}
					        onClick={this.onCreateNewEventButtonClick}
					>Create new event
					</Button>
				)
			}
		}
	}

	getBackButton = (step) => {
		switch (step) {
			case 'event name' : {
				return (
					<Button color={'grey'}
						onClick={this.props.onClose}
					>Cancel
					</Button>
				)
			}
			case 'upload codes': {
				return (
					<Button color={'grey'}
						onClick={() => this.setState({step: 'event name'})}
					>Back
					</Button>
				)
			}
			case 'confirmation': {
				return (
					<Button color={'grey'}
						onClick={() => this.setState({step: 'upload codes'})}
					>Back
					</Button>
				)
			}
		}
	}

	render() {
		return (
			<Modal
				open={this.props.open}
				onClose={this.props.onClose}
				dimmer={'blurring'}	closeIcon
				closeOnDimmerClick={false}
			>
				<Modal.Header>Create a new event</Modal.Header>
				<Step.Group attached='top'>
					<Step active={this.state.step === 'event name'}>
						<Icon name='truck' />
						<Step.Content>
							<Step.Title>Event name</Step.Title>
						</Step.Content>
					</Step>

					<Step active={this.state.step === 'upload codes'}>
						<Icon name='payment' />
						<Step.Content>
							<Step.Title>Upload codes (optional)</Step.Title>
						</Step.Content>
					</Step>

					<Step active={this.state.step === 'confirmation'}>
						<Icon name='info circle' />
						<Step.Content>
							<Step.Title>Confirm Order</Step.Title>
						</Step.Content>
					</Step>
				</Step.Group>

				<Modal.Content attached>
					{this.getModalContent(this.state.step)}
				</Modal.Content>
				<Modal.Actions>
					{this.getBackButton(this.state.step)}
					{this.getNextButton(this.state.step)}
				</Modal.Actions>
			</Modal>
		)
	}

	onEventNameInputChange = (event) => {
		this.setState(Object.assign({}, {eventName: event.target.value}, this.validateEventName(event.target.value)))
	}

	onFileDrop = (acceptedFiles, rejectedFiles) => {
		logger(acceptedFiles[0], 'accepted file')
		if (this.isSupportedFileTypes(acceptedFiles[0].name)) {
			this.setState({
				uploadedFile: acceptedFiles[0],
				isDropzoneEnabled: false,
				isParsing: true,
				parsingResult: null
			})
			this.parseUploadedFile(acceptedFiles[0])
		} else {

		}
	}

	isSupportedFileTypes = (fileName) => {
		return this.isCsv(fileName) || this.isExcelSheet(fileName)
	}

	isCsv = (fileName) => {
		return fileName.toLowerCase().endsWith('.csv')
	}

	isExcelSheet = (fileName) => {
		return fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls')
	}

	onCreateNewEventButtonClick = () => {
		firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/' + this.state.eventName).set({
			dateCreated: new Date().toLocaleString()
		}).then(result => {
			firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/' + this.state.eventName + '/codes').update(this.state.eventData).then(result => {
				this.props.onClose()
			})
		})
	}

	parseUploadedFile = (file) => {
		if (this.isCsv(file.name)) {
			Papa.parse(file, {
				complete: results => {
					logger("papaparse results", results)

					let firebaseUploadData = {}

					var validRows = 0
					var invalidRows = 0

					Object.keys(results.data).map(key => {
						if (results.data[key].length === 1 && results.data[key][0] === '') return

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

						this.setState({
							isParsing: false,
							isDropzoneEnabled: true,
							parsingResult: this.getParsingResult(invalidRows, validRows),
							eventData: firebaseUploadData
						})
					})

					logger('firebase data upload object', firebaseUploadData)
					logger('valid rows: ' + validRows)
					logger('invalid rows: ' + invalidRows)
				}
			})
		} else if (this.isExcelSheet(file.name)) {
			var reader = new FileReader()

			reader.onload = (e) => {
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
				try {
					csvString = XLSX.utils.sheet_to_csv(workbook.Sheets['codes'])
				} catch (e) {
					this.setState({
						status: 'DONE',
						errorType: 'NO_CODE_SHEET',
						errorDetails: "Failed to find a 'codes' sheet",
					})
					return
				}
				Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets['codes']), {
					complete: results => {
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

						this.setState({
							isParsing: false,
							isDropzoneEnabled: true,
							parsingResult: this.getParsingResult(invalidRows, validRows),
							eventData: firebaseUploadData
						})
					}
				})
			}
			reader.readAsArrayBuffer(file)
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

	validateEventName = (name) => {
		if (!name || name === '' || name.includes('.') || name.includes('#')
			|| name.includes('$') || name.includes('[')
			|| name.includes(']') || name.trim() === '') {
			console.log("Input is validated -> illegal characters in code")
			return {
				eventNameError: 'Event name must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"'
			}
		} else {
			return {
				eventNameError: null
			}
		}
	}

	getParsingResult = (invalidRows, validRows) => {
		return 'This file contains ' + validRows + ' valid row' + (validRows > 1 ? 's ' : ' ') + 'and ' + invalidRows + ' invalid row' + (invalidRows > 1 ? 's ' : ' ')
	}

}

export default NewEventModal
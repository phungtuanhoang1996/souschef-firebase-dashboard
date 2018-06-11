import {
	Card,
	ModalHeader,
	CardHeader,
	Carousel,
	CarouselItem,
	Modal,
	ModalBody,
	ModalFooter,
	Button,
	Progress
} from 'reactstrap'
import firebase from 'firebase'
import React from 'react'
import Dropzone from 'react-dropzone'
import logger from '../../../Utils/logger'
import Papa from 'papaparse'
import moment from "moment";

export default class ImportCsvModal extends React.Component {
	numberOfStages = 3

	constructor(props) {
		super(props)
		this.state = {
			currentStage: 0,
			uploadedFile: null,
			status: ''
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.isOpen && !nextProps.isOpen) {
			setTimeout(() => {
				this.setState({
					currentStage: 0,
					uploadedFile: null,
					status: ''
				})
			}, 1000)
		}
	}

	next = () => {
		this.setState({
			currentStage: this.state.currentStage < this.numberOfStages - 1
						? this.state.currentStage + 1 : this.state.currentStage
		})
	}

	previous = () => {
		this.setState({
			currentStage: this.state.currentStage > 0
						? this.state.currentStage - 1 : this.state.currentStage
		})
	}

	getCurrentStage = () => {
		switch (this.state.currentStage) {
			case 0: {
				return (
					<div>
						<p>This is a feature that allows you to import codes in a CSV file</p>
						<p>Each row in the CSV file must follow this format</p>
						<p>[QR][Start Date][End Date][Use Count]</p>
						<p>QR cannot contain ".", "#", "$", "[", or "]"</p>
						<p>Start and end dates must be in DD/MM/YYYY</p>
						<p>Use count must be a positive number</p>
						<p>For example: qrcode,01/01/2000,02/01/2000,5</p>
					</div>
				)
			}
			case 1: {
				return (
					<div>
						<p>Drag the CSV file below or click to choose file to upload</p>
						<Dropzone accept=".csv" multiple={false} onDrop={this.onDrop}/>
						<p>Uploaded file: {this.state.uploadedFile === null ? 'None' : this.state.uploadedFile.name}</p>
					</div>
				)
			}
			case 2: {
				return (
					<div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							{!this.state.status.includes('done')
								? <Progress animated value={100} style={{width: "33%"}}/>
								: null
							}
							{this.state.status === 'done'
								? <Progress striped color="success" value={100} style={{width: "33%"}}/>
								: null
							}
							{this.state.status === 'done with error'
								? <Progress striped color="warning" value={100} style={{width: "33%"}}/>
								: null
							}
							</div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							{this.state.status === '' ? <p>Parsing...</p> : null}
							{this.state.status === 'upload_firebase' ? <p>Uploading...</p> : null}
							{this.state.status === 'done' ? <p>Done!</p> : null}
							{this.state.status === 'done with error' ? <p>Done with errors</p>: null}
						</div>
						{ (this.state.status === 'upload_firebase' || this.state.status.includes('done')) ?
							<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
								<p>Parsed CSV file</p>
							</div> : null
						}
						{ (this.state.status === 'done') ?
							<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
								<p>Uploaded all codes to database</p>
							</div> : null
						}
						{ (this.state.status === 'done with error') ?
							<div>
								<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
									<p>Uploaded {this.state.validRows} code(s) to database</p>
								</div>
								<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
									<p>{this.state.invalidRows} row(s) from .CSV file were invalid</p>
								</div>
							</div> : null
						}
					</div>
				)
			}
		}
	}

	onDrop = (acceptedFiles, rejectedFiles) => {
		logger('Dropzone', acceptedFiles[0])
		if (acceptedFiles[0] && acceptedFiles[0] !== null) {
			this.setState({
				uploadedFile: acceptedFiles[0]
			})
		}
	}

	parseAndUpload = () => {
		Papa.parse(this.state.uploadedFile, {
			complete: results => {
				this.setState({
					status: 'upload_firebase'
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
				logger('valid rows: ' + validRows)
				logger('invalid rows: ' + invalidRows)

				firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/ongoing/codes').update(
					firebaseUploadData
				).then(success => {
					this.setState({
						status: (invalidRows === 0) ? 'done' : 'done with error',
						validRows: validRows,
						invalidRows: invalidRows
					})
					logger('parsed and uploaded to firebase')
				}, error => {
					logger('failed to parse and upload to firebase', error.message)
				})
			}
		})
	}

	getNextButton = () =>{
		switch (this.state.currentStage) {
			case 0: return (
				<Button color="primary" onClick={this.next}>Next</Button>
			)
			case 1: return (
				<Button color="success" onClick={() => {
					if (this.state.currentStage === 1) this.parseAndUpload()
					this.next()
				}}>Upload</Button>
			)
			case 2: return (
				<Button color="success" onClick={this.props.toggle}>Close</Button>
			)
			default: return (
				<Button color="primary" onClick={this.next}>Next</Button>
			)
		}
	}

	getPreviousButton = () => {
		switch (this.state.currentStage) {
			case 0: return null
			case 1: return (
				<Button color="primary" onClick={() => {
					this.previous()
					this.setState({
						uploadedFile: null
					})
				}}>Back</Button>
			)
			case 2: return (
				<Button color="primary" onClick={() => {
					this.previous()
					this.setState({
						uploadedFile: null,
						status: ''
					})
				}}>Import another</Button>
			)
			default: return (
				<Button color="primary" onClick={this.next}>Next</Button>
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
		var startDate = moment(_startDate, "DD/MM/YYYY")
		var endDate = moment(_endDate, "DD/MM/YYYY")

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
		return (
			<Modal size='lg' style={{height: '50%'}} isOpen={this.props.isOpen} toggle={() => this.props.toggle()}>
				<ModalHeader toggle={this.props.toggle}>Bulk import from CSV</ModalHeader>
				<ModalBody style={{height: '500px'}}>
					{this.getCurrentStage()}
				</ModalBody>
				<ModalFooter>
					{this.getPreviousButton()}
					{this.getNextButton()}
				</ModalFooter>
			</Modal>
		)
	}
}
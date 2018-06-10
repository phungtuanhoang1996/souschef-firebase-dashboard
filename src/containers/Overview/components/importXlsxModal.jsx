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
import XLSX from 'xlsx'

export default class ImportXlsxModal extends React.Component {
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
		if (this.props.isOpen || !nextProps.isOpen) {
			this.setState({
				currentStage: 0,
				uploadedFile: null,
				status: ''
			})
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
						<p>Drag the XLS / XLSX file below or click to choose file to upload</p>
						<Dropzone onDrop={this.onDrop}/>
						<p>Uploaded file: {this.state.uploadedFile === null ? 'None' : this.state.uploadedFile.name}</p>
					</div>
				)
			}
			case 2: {
				return (
					<div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							{this.state.status !== 'done'
								? <Progress animated value={100} style={{width: "33%"}}/>
								: <Progress striped color="success" value={100} style={{width: "33%"}}/>
							}
						</div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							{this.state.status === '' ? <p>Parsing...</p> : null}
							{this.state.status === 'upload_firebase' ? <p>Uploading...</p> : null}
							{this.state.status === 'done' ? <p>Done!</p> : null}
						</div>
						{ (this.state.status === 'upload_firebase' || this.state.status === 'done') ?
							<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
								<p>Parsed CSV file</p>
							</div> : null
						}
						{ (this.state.status === 'done') ?
							<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
								<p>Uploaded to database</p>
							</div> : null
						}
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
			var workbook = XLSX.read(reader.result, {type: 'array'})
			logger('csv', XLSX.utils.sheet_to_csv(workbook.Sheets['codes']))
			Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets['codes']), {
				complete: results => {
					this.setState({
						status: 'upload_firebase'
					})

					logger("papaparse results", results)

					let firebaseUploadData = {}

					Object.keys(results.data).map(key => {
						let code = results.data[key][0]
						let startDate = results.data[key][1]
						let endDate = results.data[key][2]
						let useCount = parseInt(results.data[key][3])
						firebaseUploadData[code] = {
							start_date: startDate,
							end_date: endDate,
							use_count: useCount
						}
					})

					logger('firebase data upload object', firebaseUploadData)

					firebase.database().ref('/brands/' + this.props.currentBrandId + '/events/ongoing/codes').update(
						firebaseUploadData
					).then(success => {
						this.setState({
							status: 'done'
						})
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

	render() {
		return (
			<Modal size='lg' style={{height: '50%'}} isOpen={this.props.isOpen} toggle={() => this.props.toggle()}>
				<ModalHeader>Bulk import from CSV</ModalHeader>
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
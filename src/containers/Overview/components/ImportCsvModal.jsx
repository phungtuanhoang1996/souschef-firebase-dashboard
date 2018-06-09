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
						<Dropzone onDrop={this.onDrop}/>
						<p>Uploaded file: {this.state.uploadedFile === null ? 'None' : this.state.uploadedFile.name}</p>
					</div>
				)
			}
			case 2: {
				return (
					<div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							<Progress animated value={100} style={{width: "33%"}} />
						</div>
						<div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
							<p>Parsing...</p>
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
		Papa.parse(this.state.uploadedFile, {
			complete: results => {
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
					logger('parsed and uploaded to firebase')
				}, error => {
					logger('failed to parse and upload to firebase', error.message)
				})
			}
		})
	}

	render() {
		return (
			<Modal size='lg' style={{height: '50%'}} isOpen={this.props.isOpen} toggle={() => this.props.toggle()}>
				<ModalHeader>Bulk import with CSV</ModalHeader>
				<ModalBody>
					{this.getCurrentStage()}
				</ModalBody>
				<ModalFooter>
					{this.state.currentStage !== 0 ? <Button color="primary" onClick={this.previous}>Back</Button> : null}
					<Button color="primary" onClick={() => {
						if (this.state.currentStage === 1) this.parseAndUpload()
						this.next()
					}}>Next</Button>
				</ModalFooter>
			</Modal>
		)
	}

}
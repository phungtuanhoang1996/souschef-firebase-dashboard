import React from 'react'
import {Modal, Input, Button, Segment, Divider, Step, Icon, List} from 'semantic-ui-react'
import firebase from 'firebase'
import Dropzone from 'react-dropzone'
import logger from "../../../Utils/logger";
import Papa from "papaparse";
import moment from "moment/moment";
import XLSX from 'xlsx'
import fileUploadIcon from '../../../resources/icons/file-upload.svg'
import xlsxIcon from '../../../resources/icons/xls-icon.svg'
import csvIcon from '../../../resources/icons/csv-icon.svg'
import CustomisedDropzone from '../../../BaseComponents/CustomisedDropzone'

class NewEventModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			step: 'event name',
			eventName: '',
			uploadedFile: null,
			uploadedFileType: null,
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
					<div style={{display: 'table', height: '100%', width: '100%'}}>
						<div align="center" style={{display: 'table-cell', verticalAlign: 'middle'}}>
							<h3>Enter the name of the event</h3>
							<Input
								value={this.state.eventName}
								onChange={this.onEventNameInputChange}
								error={this.state.eventNameError === 'Event name must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"' }
								onKeyDown={(event) => {if (event.keyCode === 13 && !this.state.eventNameError) this.setState({step: 'upload codes'})}}
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
					</div>
				)
			}
			case 'upload codes': {
				return (
					<div style={{display: 'table', height: '100%', width: '100%'}}>
						<div align='center' style={{display: 'table-cell', verticalAlign: 'middle'}}>
							<h3>Import code from a .XLSX / .CSV file for the event</h3>

							<CustomisedDropzone
								onFileDrop={this.onFileDrop}
								onParsingComplete={this.onParsingComplete}
							/>
						</div>
					</div>
				)
			}
			case 'confirmation': {
				return (
					<div style={{display: 'table', height: '100%', width: '100%'}}>
						<div align="center" style={{display: 'table-cell', verticalAlign: 'middle'}}>
							<h3>Create the following event?</h3>
							<p><Icon name={'arrow right'} size={'small'} color={'blue'}/>Event name: <b>{this.state.eventName}</b></p>
							<p><Icon name={'arrow right'} size={'small'} color={'blue'}/>Import codes from file: <b>{this.state.uploadedFile ? this.state.uploadedFile.name : 'None'}</b></p>
							{
								this.state.uploadedFile ? (
									<p><Icon name={'arrow right'} size={'small'} color={'blue'}/>{this.state.parsingResult}</p>
								) : null
							}
						</div>
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
						<Icon name='pencil' />
						<Step.Content>
							<Step.Title>Event name</Step.Title>
						</Step.Content>
					</Step>

					<Step active={this.state.step === 'upload codes'}>
						<Icon name='qrcode' />
						<Step.Content>
							<Step.Title>Upload codes (optional)</Step.Title>
						</Step.Content>
					</Step>

					<Step active={this.state.step === 'confirmation'}>
						<Icon name='info circle' />
						<Step.Content>
							<Step.Title>Confirm</Step.Title>
						</Step.Content>
					</Step>
				</Step.Group>

				<Modal.Content attached style={{height: '300px'}}>
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

	onFileDrop = (file) => {
		this.setState({
			uploadedFile: file
		})
	}

	onParsingComplete = (eventData, parsingResult) => {
		this.setState({
			eventData: eventData,
			parsingResult: parsingResult
		})
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
}

export default NewEventModal
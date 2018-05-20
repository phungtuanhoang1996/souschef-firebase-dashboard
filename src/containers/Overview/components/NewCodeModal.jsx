import {
	Input,
	InputGroupAddon,
	InputGroup,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Collapse,
	Card,
	CardBody
} from 'reactstrap'
import React from 'react'
import QrReader from 'react-qr-reader'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import firebase from 'firebase'

import 'react-datepicker/dist/react-datepicker.css';

export default class CodeModificationModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			code: '',
			startDate: '',
			endDate: '',
			useCount: '',
			helperComponentFocus: null,
			qrCodeScannerRendering: false, // this particular qr scanner must not be rendered while hidden in a Collapse
			invalidInputCollapse: false,
			inputValidity: {

			}
		}
	}

	render() {
		return (
			<div>
				<Modal isOpen={this.props.isOpen} toggle={() => this.props.toggle()} className={this.props.className}>
					<ModalHeader toggle={() => this.props.toggle()}>Modify QR code</ModalHeader>
					<ModalBody>
						<div
							style={{marginBottom: '5px'}}
						>
							Code
						</div>

						<InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}} onClick={() => {this.closeInvalidInputCollapse()}}>
							<Input
								value={this.state.code}
								onChange={(event) => {
									this.handleQRchange(event)
								}}
							>
							</Input>
							<InputGroupAddon addonType='append'>
								<Button onClick={() => this.toggleQrScanner()}>QR Scanner</Button>
							</InputGroupAddon>
						</InputGroup>

						<Collapse isOpen={this.state.helperComponentFocus === 'qr'}>
							{this.state.qrCodeScannerRendering ? (<QrReader
								delay={500}
								onError={(error) => this.handleQrError(error)}
								onScan={(result) => this.handleQrResult(result)}
								style={{width: '100%'}}
							/>) : null}
						</Collapse>

						<div
							style={{marginBottom: '5px', marginTop: '5px'}}
						>
							Start Date
						</div>

						<InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}} onClick={() => {this.closeInvalidInputCollapse()}}>
							<Input
								type='text'
								value={this.state.startDate}
								onChange={(event) => {
									this.handleStartDateChange(event)
								}}
							>
							</Input>
							<InputGroupAddon addonType='append'>
								<Button onClick={() => this.toggleStartDatePicker()}>Date Picker</Button>
							</InputGroupAddon>
						</InputGroup>

						<Collapse
							isOpen={this.state.helperComponentFocus === 'startDatePicker'}
						>
							<div style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
								<DatePicker
									inline
									selected={(moment(this.state.startDate, 'DD/MM/YYYY').isValid()) ? moment(this.state.startDate, 'DD/MM/YYYY') : moment()}
									onChange={date => {
										this.handleStartDateSelected(date)
									}}
								/>
							</div>
						</Collapse>

						<div
							style={{marginBottom: '5px', marginTop: '5px'}}
						>
							End Date
						</div>

						<InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}} onClick={() => {this.closeInvalidInputCollapse()}}>
							<Input
								value={this.state.endDate}
								onChange={(event) => {
									this.handleEndDateChange(event)
								}}
							>
							</Input>
							<InputGroupAddon addonType='append'>
								<Button onClick={() => this.toggleEndDatePicker()}>Date Picker</Button>
							</InputGroupAddon>
						</InputGroup>

						<Collapse isOpen={this.state.helperComponentFocus === 'endDatePicker'}>
							<div style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
								<DatePicker
									inline
									selected={(moment(this.state.endDate, 'DD/MM/YYYY').isValid()) ? moment(this.state.endDate, 'DD/MM/YYYY') : moment()}
									onChange={date => {
										this.handleEndDateSelected(date)
									}}
								/>
							</div>
						</Collapse>

						<div
							style={{marginBottom: '5px', marginTop: '5px'}}
						>
							Use Count
						</div>

						<Input
							type="number"
							value={this.state.useCount}
							onChange={(event) => {
								this.handleUseCountChange(event)
							}}
							style={{marginBottom: '5px', marginTop: '5px'}}
							onClick={() => {this.closeInvalidInputCollapse()}}>
						</Input>

						<Collapse isOpen={this.state.invalidInputCollapse}>
							<Card>
								<CardBody>
									{this.state.inputValidity.codeIllegalChar ? <p>- Code must be a non-empty string and can not contain ".", "#", "$", "[", or "]"</p> : null}
									{this.state.inputValidity.datesFormatWrong ? <p>- Format of dates is wrong. Must be in DD/MM/YYYY</p> : null}
									{this.state.inputValidity.startDateAfterEndDate ? <p>- End date must be after start date</p> : null}
									{this.state.inputValidity.useCountWrongFormat ? <p>- Use count must be a positive number</p> : null}
								</CardBody>
							</Card>
						</Collapse>

					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={() => this.handleAddButtonClicked()}>Add</Button>
						{' '}
						<Button color="secondary" onClick={() => this.props.toggle()}>Cancel</Button>
					</ModalFooter>
				</Modal>
			</div>
		)
	}

	toggleQrScanner = () => {
		if (this.state.helperComponentFocus === 'qr') {
			this.setState({
				helperComponentFocus: null
			})
			setTimeout(() => {
				this.setState({
					qrCodeScannerRendering: false
				})
			}, 1000)
		} else {
			this.setState({
				helperComponentFocus: 'qr',
				qrCodeScannerRendering: true
			})
		}
	}

	toggleStartDatePicker = () => {
		if (this.state.helperComponentFocus === 'startDatePicker') {
			this.setState({
				helperComponentFocus: null
			})
		} else {
			this.setState({
				helperComponentFocus: 'startDatePicker'
			})
			setTimeout(() => {
				this.setState({
					qrCodeScannerRendering: false
				})
			}, 1000)
		}
	}

	toggleEndDatePicker = () => {
		if (this.state.helperComponentFocus === 'endDatePicker') {
			this.setState({
				helperComponentFocus: null
			})
		} else {
			this.setState({
				helperComponentFocus: 'endDatePicker'
			})
			setTimeout(() => {
				this.setState({
					qrCodeScannerRendering: false
				})
			}, 1000)
		}
	}

	handleQrError = (error) => {
		console.log(error)
		this.toggleQrScanner()
	}

	handleQrResult = (result) => {
		if (result !== null && this.state.helperComponentFocus === 'qr') {
			this.setState(prevState => ({
				code: result,
				helperComponentFocus: null
			}))
			setTimeout(() => {
				this.setState({
					qrCodeScannerRendering: false
				})
			}, 1000)
		}
	}

	handleEndDateSelected = (date) => {
		this.setState({
			endDate: date.format("DD/MM/YYYY")
		})
	}

	handleStartDateSelected = (date) => {
		this.setState({
			startDate: date.format("DD/MM/YYYY")
		})
	}

	handleStartDateChange = (event) => {
		this.setState({
			startDate: event.target.value
		})
	}

	handleEndDateChange = (event) => {
		this.setState({
			endDate: event.target.value
		})
	}

	handleUseCountChange = (event) => {
		this.setState({
			useCount: parseInt(event.target.value)
		})
	}

	handleQRchange = (event) => {
		this.setState({
			code: event.target.value
		})
	}

	closeInvalidInputCollapse = () => {
		this.setState({
			invalidInputCollapse: false
		})
	}

	validateInput = () => {
		var validationResult = {
			isValid: true
		}

		//check start/end date format
		//check end date is after start date
		var startDate = moment(this.state.startDate, "DD/MM/YYYY")
		var endDate = moment(this.state.endDate, "DD/MM/YYYY")

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
		if (!Number.isInteger(this.state.useCount) || this.state.useCount < 0) {
			console.log("Input is validated -> use count format wrong")
			validationResult = {
				...validationResult, useCountWrongFormat: true, isValid: false
			}
		}

		// check if QR contains illegal characters
		// Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
		if (this.state.code.includes('.') || this.state.code.includes('#')
			|| this.state.code.includes('$') || this.state.code.includes('[')
			|| this.state.code.includes(']') || this.state.code === '') {
			console.log("Input is validated -> illegal characters in code")
			validationResult = {
				...validationResult, codeIllegalChar: true, isValid: false
			}
		}

		console.log('At the end of validity check: isValid is ' + validationResult.isValid)
		return validationResult
	}

	handleAddButtonClicked = () => {
		var validationResult = this.validateInput()

		if (!validationResult.isValid) {
			console.log("Add button clicked but input is INVALID")
			console.log((this.state.inputValidity))
			this.setState({
				helperComponentFocus: null,
				invalidInputCollapse: true,
				inputValidity: validationResult
			})
		} else {
			console.log("Save changes clicked, input is VALID")

			firebase.database().ref('/brands/' + this.props.details.currentBrandId + '/events/' + this.props.details.eventType + '/codes/' + this.state.code).update({
				start_date: this.state.startDate,
				end_date: this.state.endDate,
				use_count: this.state.useCount
			}).then((success) => {
				this.props.toggle()
				console.log(success)
			}, (error) => {
				console.log(error)
			})

			this.setState({
				code: '',
				startDate: '',
				endDate: '',
				useCount: '',
				helperComponentFocus: null,
				qrCodeScannerRendering: false, // this particular qr scanner must not be rendered while hidden in a Collapse
				invalidInputCollapse: false,
				inputValidity: {

				}
			})
		}
	}
}
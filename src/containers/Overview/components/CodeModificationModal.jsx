import {Input, InputGroupAddon, InputGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap'
import React from 'react'
import QrReader from 'react-qr-reader'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css';

export default class CodeModificationModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            details: props.details, // include code, start date, end date and use count
            helperComponentFocus: null,
            qrCodeScannerRendering: false // this particular qr scanner must not be rendered while hidden in a Collapse 
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.state = {
                details: nextProps.details,
                helperComponentFocus: null,
                qrCodeScannerRendering: false
            }
        }
    }

    render() {
        console.log(this.state.details)
        if (this.state.details && this.state.details.startDate) console.log(moment(this.state.details.startDate, "DD/MM/YYYY"))
		  if (this.state.details && this.state.details.endDate) console.log(moment(this.state.details.endDate, "DD/MM/YYYY"))
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={()=>this.props.toggle()} className={this.props.className}>
                    <ModalHeader toggle={()=>this.props.toggle()}>Modify QR code</ModalHeader>
                    <ModalBody>
                            <div
                                style={{marginBottom: '5px'}}
                            >
                                Code
                            </div>

                            <InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}}>
                                <Input 
                                    value={this.state.details ? this.state.details.code : null}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleQrScanner()}>QR Scanner</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse isOpen={this.state.helperComponentFocus === 'qr' ? true : false}>
                                { this.state.qrCodeScannerRendering  ? (<QrReader
                                    delay={500}
                                    onError={(error) => this.handleQrError(error)}
                                    onScan={(result) => this.handleQrResult(result)}
                                    style={{ width: '100%' }}
                                />) : null}
                            </Collapse>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                Start Date
                            </div>

                            <InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}}>
                                <Input
                                    type='text'
                                    value={this.state.details && this.state.details.startDate !== '' ? this.state.details.startDate : "Not set"}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleStartDatePicker()}>Date Picker</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse
                               isOpen={this.state.helperComponentFocus === 'startDatePicker' ? true : false}
                            >
                                <div style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
                                    <DatePicker
                                        inline
													 selected={(this.state.details && this.state.details.startDate) ? moment(this.state.details.startDate , 'DD/MM/YYYY') : moment()}
													 onChange={date => {this.handleStartDateChange(date)}}
                                    />
                                </div>
                            </Collapse>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                End Date
                            </div>

                            <InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}}>
                                <Input
                                    value={(this.state.details && this.state.details.endDate !== '') ? this.state.details.endDate : "Not set"}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleEndDatePicker()}>Date Picker</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse isOpen={this.state.helperComponentFocus === 'endDatePicker' ? true : false}>
                                <div style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center"}}>
                                    <DatePicker
                                        inline
                                        selected={(this.state.details && this.state.details.endDate) ? moment(this.state.details.endDate, 'DD/MM/YYYY')  : moment()}
                                        onChange={date => {this.handleEndDateChange(date)}}
                                    />
                                </div>
                            </Collapse>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                Use Count
                            </div>

                            <Input 
                                defaultValue={this.props.details ? this.props.details.useCount : null}
                                style={{marginBottom: '5px', marginTop: '5px'}}>
                            </Input>
                                            
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=>this.props.toggle()}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={()=>this.props.toggle()}>Cancel</Button>
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
                details: {
                    ...prevState.details,
                    code: result
                }, 
                helperComponentFocus: null
            }))
            setTimeout(() => {
                this.setState({
                    qrCodeScannerRendering: false
                })
            }, 1000)
        }
    }

    handleEndDateChange = (date) => {
		 this.setState({
          details: {
             ...this.state.details,
             endDate: date.format("DD/MM/YYYY")
          }
       })
	 }

	 handleStartDateChange = (date) => {
        this.setState({
           details: {
              ...this.state.details,
              startDate: date.format("DD/MM/YYYY")
           }
        })
    }
}
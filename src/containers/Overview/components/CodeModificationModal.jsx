import {Input, InputGroupAddon, InputGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap'
import React from 'react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

export default class CodeModificationModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            details: props.details, // include code, start date, end date and use count
            helperComponentFocus: null
        }
    }

    render() {
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
                                    defaultValue={this.props.details ? this.props.details.code : null}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleQrScanner()}>QR Scanner</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse isOpen={this.state.helperComponentFocus === 'qr' ? true : false}>
                                <p>Placeholder for qr scanner</p>
                            </Collapse>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                Start Date
                            </div>

                            <InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}}>
                                <Input 
                                    defaultValue={this.props.details && this.props.details.startDate !== '' ? this.props.details.startDate : "Not set"}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleStartDatePicker()}>Date Picker</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse isOpen={this.state.helperComponentFocus === 'startDatePicker' ? true : false}>
                                <p>Placeholder for start date picker</p>
                            </Collapse>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                End Date
                            </div>

                            <InputGroup size='normal' style={{marginBottom: '5px', marginTop: '5px'}}>
                                <Input 
                                    defaultValue={this.props.details && this.props.details.endDate !== '' ? this.props.details.endDate : "Not set"}
                                >
                                </Input>
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={() => this.toggleEndDatePicker()}>Date Picker</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <Collapse isOpen={this.state.helperComponentFocus === 'endDatePicker' ? true : false}>
                                <p>Placeholder for end date pickerr</p>
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
        } else {
            this.setState({
                helperComponentFocus: 'qr'
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
        }
    }
}
import {Input, InputGroupAddon, InputGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import React from 'react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

export default class CodeModificationModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            details: props.details // include code, start date, end date and use count
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

                            <Input 
                                defaultValue={this.props.details ? this.props.details.code : null}
                                style={{marginBottom: '5px', marginTop: '5px'}}>
                            </Input>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                Start Date
                            </div>

                            <Input 
                                defaultValue={this.props.details && this.props.details.startDate !== '' ? this.props.details.startDate : "Not set"}
                                style={{marginBottom: '5px', marginTop: '5px'}}>
                            </Input>

                            <div
                                style={{marginBottom: '5px', marginTop: '5px'}}
                            >
                                End Date
                            </div>

                            <Input 
                                defaultValue={this.props.details && this.props.details.endDate !== '' ? this.props.details.endDate : "Not set"}
                                style={{marginBottom: '5px', marginTop: '5px'}}>
                            </Input>

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
}
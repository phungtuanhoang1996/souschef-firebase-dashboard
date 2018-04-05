import React from 'react';
import MachinesCardComponent from './components/MachinesCardComponent';
import CodeCardComponent from './components/CodeCardComponent';
import './OverviewComponent.css';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import {styled} from 'styled-components';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, withFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

const mapStateToProps = (state) => {
    console.log('state is')
    console.log(state)

    return {
        currentBrandId: state.currentBrandId,
        firebase: state.firebase
    }
}

class OverviewComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            event: 'ongoing'
        }
    }
    render () {
        console.log('this.props.firebase')
        console.log(this.props.firebase)
        console.log('this.props.currentBrandID')
        console.log(this.props.currentBrandId)
        console.log('this.state.event')
        console.log(this.state.event)

        return (
            <div className="wrapper">
                <Card>
                    <CardHeader>Machines</CardHeader>
                    <Row>
                        <Col sm="6">
                            <MachinesCardComponent title="Online" machines={this.props.onlineMachines}/>                
                        </Col>
                        <Col sm="6">
                            <MachinesCardComponent title="Offline" machines={this.props.offlineMachines}/>                
                        </Col>
                    </Row>
                </Card>
                <CodeCardComponent 
                    selectedEvent={this.state.event} 
                    changeSelectedEvent={this.changeSelectedEvent}
                    codes={this.props.codes}/>     
            </div>
        );
    }

    // codes = () => {
    //     console.log('firebase')
    //     console.log(this.props.firebase)
    //     if (this.state.event === 'ongoing') {
    //         return 
    //     } else if (this.state.event === 'offgoing') {
    //         return null
    //     } else return null
    // }

    changeSelectedEvent = (event) => {
        console.log('changeSelectedEvent: clicked on ' + event)
        this.setState({
            event: event
        })
    }
}

export default connect(mapStateToProps, null)(OverviewComponent)
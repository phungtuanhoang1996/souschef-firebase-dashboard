import React from 'react';
import MachinesCardComponent from './components/MachinesCardComponent';
import CodeCardComponent from './components/CodeCardComponent';
import './OverviewComponent.css';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import {styled} from 'styled-components';

export default class OverviewComponent extends React.Component {
    render () {
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
                                selectedEvent={this.props.selectedEvent} 
                                changeSelectedEvent={this.props.changeSelectedEvent}
                                codes={this.props.codes}/>     
            </div>
        );
    }
}
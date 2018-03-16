import React from 'react';
import MachinesCardComponent from './MachinesCardComponent';
import './OverviewComponent.css';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

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
            </div>
        );
    }
}
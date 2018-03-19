import React from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, ListGroup, ListGroupItem, Table } from 'reactstrap';
import {styled} from 'styled-components';

const MachinesCardComponent = (props) => {
    return (
        <Card>
        <CardHeader>{props.title}</CardHeader>
        <CardBody>
            {
                Object.keys(props.machines).length != 0 ? 
                <div>
                    <CardSubtitle>{Object.keys(props.machines).length} machines are currently {props.title.toString().toLowerCase()}</CardSubtitle>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Machine Name</th>
                                <th>Last Online</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            Object.keys(props.machines).map((machine, key) => {
                                return <tr key={key}>
                                    <td  key={machine}>{machine}</td>
                                    <td  key={props.machines[machine].last_online}>{props.machines[machine].last_online}</td>
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>
                </div> : 
                    <CardSubtitle>No machines are currently {props.title.toString().toLowerCase()}</CardSubtitle>
                }
        </CardBody>
    </Card>
    );
}

export default MachinesCardComponent;
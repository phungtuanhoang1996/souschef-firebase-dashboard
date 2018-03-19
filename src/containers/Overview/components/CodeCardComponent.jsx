import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardSubtitle, Col, DropdownItem, DropdownToggle, DropdownMenu, Row, Table, UncontrolledDropdown } from 'reactstrap';

const CodeCardComponent = (props) => {
    return(
        <Card>
            <CardHeader>Event Codes</CardHeader>
            <CardBody>
                <CardSubtitle>
                    <Row>
                        <Col>
                            <UncontrolledDropdown>
                                <DropdownToggle caret>
                                    {props.selectedEvent}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header>Event</DropdownItem>
                                    <DropdownItem divider/>
                                    {
                                        Object.keys(props.codes).map((event, i)=>{
                                            return <div key={i}><DropdownItem disabled key={i} onClick={(e)=>{props.changeSelectedEvent(event)}}>
                                                    {event}
                                                </DropdownItem><DropdownItem divider/></div>

                                        })
                                    }
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                        <Col>
                            Code Count: {' '}
                            {console.log(props.codes)
                            }
                            {                            console.log(Object.keys(props.codes).length)
}
                            {
                                Object.keys(props.codes).length != 0 ? 
                                Object.keys(props.codes).length :
                                0
                             }
                        </Col>
                    </Row>
                </CardSubtitle>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Uses Left</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(props.codes).length != 0 ? 
                        Object.keys(props.codes[props.selectedEvent].codes).map((code)=>{
                            return <tr>
                                <td>
                                    {code}
                                </td>
                                <td>
                                    {props.codes[props.selectedEvent].codes[code].use_count}
                                </td>
                                <td>
                                    {
                                        props.codes[props.selectedEvent].codes[code].start_date != "" ?
                                        props.codes[props.selectedEvent].codes[code].start_date : "N/A"
                                    }
                                </td>
                                <td>
                                    {
                                        props.codes[props.selectedEvent].codes[code].end_date != "" ?
                                        props.codes[props.selectedEvent].codes[code].end_date : "N/A"
                                    }
                                </td>
                            </tr>
                        })
                         : null
                    }
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
}

export default CodeCardComponent;

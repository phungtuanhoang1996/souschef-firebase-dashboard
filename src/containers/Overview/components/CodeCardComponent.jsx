import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, CardSubtitle, Col, DropdownItem, DropdownToggle, DropdownMenu, Row, Table, UncontrolledDropdown } from 'reactstrap';

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
                                            if (i !== Object.keys(props.codes).length - 1) {
                                                return <div key={i}><DropdownItem key={i} onClick={(e)=>{props.changeSelectedEvent(event)}}>
                                                        {event}
                                                </DropdownItem><DropdownItem divider/></div> 
                                            } else {
                                                return <div key={i}><DropdownItem key={i} onClick={(e)=>{props.changeSelectedEvent(event)}}>
                                                        {event}
                                                        </DropdownItem></div>
                                            }
                                        })
                                    }
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                        <Col>
                            Code Count: {' '}
                            {console.log(props.codes)}
                            {console.log(Object.keys(props.codes).length)}
                            {
                                Object.keys(props.codes).length != 0 ? Object.keys(props.codes).length : 0
                            }
                        </Col>
                    </Row>
                </CardSubtitle>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th width="40%">Code</th>
                            <th width="15%">Uses Left</th>
                            <th width="15%">Start Date</th>
                            <th width="15%">End Date</th>
                            <th width="15%"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(props.codes).length != 0 ? 
                        Object.keys(props.codes[props.selectedEvent].codes).map((code)=>{
                            return <tr>
                                <td style={styles.tableData}>
                                    {code}
                                </td>
                                <td style={styles.tableData}>
                                    {props.codes[props.selectedEvent].codes[code].use_count}
                                </td>
                                <td style={styles.tableData}>
                                    {
                                        props.codes[props.selectedEvent].codes[code].start_date != "" ?
                                        props.codes[props.selectedEvent].codes[code].start_date : "N/A"
                                    }
                                </td>
                                <td style={styles.tableData}>
                                    {
                                        props.codes[props.selectedEvent].codes[code].end_date != "" ?
                                        props.codes[props.selectedEvent].codes[code].end_date : "N/A"
                                    }
                                </td>
                                <td style={styles.modifyButtonCell}>
                                    <Button onClick={() => {
                                            props.onModifyButtonClicked(code, 
                                                props.codes[props.selectedEvent].codes[code].start_date,
                                                props.codes[props.selectedEvent].codes[code].end_date,
                                                props.codes[props.selectedEvent].codes[code].use_count
                                            )}
                                        }
                                    >
                                        Modify
                                    </Button>
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

const styles = {
    tableData: {
        verticalAlign: "middle",
    },
    modifyButtonCell: {
        textAlign: "center"
    }
}

export default CodeCardComponent;

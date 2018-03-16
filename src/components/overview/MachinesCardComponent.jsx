import React from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, ListGroup, ListGroupItem, Table } from 'reactstrap';

export default class MachinesCardComponent extends React.Component {

    render(){
        return (
            <Card>
            <CardHeader>{this.props.title}</CardHeader>
            <CardBody>
                <CardSubtitle>Count: {Object.keys(this.props.machines).length}</CardSubtitle>
                {
                    Object.keys(this.props.machines).length != 0 ? 
                    <ListGroup>
                        {
                            Object.keys(this.props.machines).map((key) => {
                                console.log(key);
                                return
                                    <ListGroupItem>
                                        {key}
                                    </ListGroupItem>
                            })
                        }
                    </ListGroup>
                    
                             : null
                }
                
            </CardBody>
        </Card>
        );
    }
    
  }
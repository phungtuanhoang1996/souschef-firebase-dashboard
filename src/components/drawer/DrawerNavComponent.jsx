import React from 'react';
import { ListGroup, ListGroupItem, Nav } from 'reactstrap';
import ProfileCardComponent from './ProfileCardComponent';

export default class DrawerNavComponent extends React.Component {
    render () {
        return(
            <Nav vertical>
                <ProfileCardComponent currentUser={this.props.currentUser} currentBrandName={this.props.currentBrandName}/>
                <ListGroup>
                    <ListGroupItem active tag="a" href="#" action>Overview</ListGroupItem>
                    <ListGroupItem tag="a" href="#" action>Machines</ListGroupItem>
                    <ListGroupItem tag="a" href="#" action>QR/barcodes</ListGroupItem>
                </ListGroup>
            </Nav>
        );
    }
}
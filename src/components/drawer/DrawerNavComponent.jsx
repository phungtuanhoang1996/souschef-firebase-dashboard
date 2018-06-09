import React from 'react';
import { ListGroup, ListGroupItem, Nav } from 'reactstrap';
import ProfileCardComponent from './ProfileCardComponent';

export default class DrawerNavComponent extends React.Component {
    render () {
        return(
            <Nav vertical>
                <ProfileCardComponent currentUser={this.props.currentUser} currentBrandName={this.props.currentBrandName}/>
                <ListGroup>
                    <ListGroupItem active={this.props.selectedItem === 'overview'} tag="a" action onClick={() => {this.props.onItemSelect('overview')}}>Overview</ListGroupItem>
                    <ListGroupItem active={this.props.selectedItem === 'machines'} tag="a" action onClick={() => {this.props.onItemSelect('machines')}}>Machines</ListGroupItem>
                    <ListGroupItem active={this.props.selectedItem === 'codes'} tag="a" action onClick={() => {this.props.onItemSelect('codes')}}>QR/barcodes</ListGroupItem>
                </ListGroup>
            </Nav>
        );
    }
}
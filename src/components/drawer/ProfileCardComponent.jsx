import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Nav, NavItem, NavLink } from 'reactstrap';

export default class ProfileCardComponent extends Component {
    render () {
        return (
            <Card>
                <CardHeader className="text-center">Brand: {this.props.currentBrandName}</CardHeader>
                <CardBody className="text-center">
                    Account: {this.props.currentUser}
                </CardBody>
            </Card>
        );
    }
}
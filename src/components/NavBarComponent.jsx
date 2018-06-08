import React, { Component } from 'react';
import { Button, Nav, Navbar, NavbarBrand, NavItem, NavbarToggler, NavLink, Collapse } from 'reactstrap';
import firebase from 'firebase'
import logger from "../Utils/logger";

export default class NavBarComponent extends Component {
    handleLogout = () => {
        firebase.auth().signOut().then(success => {
            logger('Logout success')
        }, error => {
            logger('Logout failed', error.message)
        })
        this.props.logout();
    }

    render() {
        return(
            <div>
                <Navbar color="info" light>
                    <NavbarBrand href="/">Souschef Realtime Dashboard</NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                {
                                    this.props.isLoggedIn ? 
                                        <Button onClick={this.handleLogout}>Logout</Button> :
                                        null
                                }
                            </NavItem>
                        </Nav>
                </Navbar>
            </div>
        );
    }
}
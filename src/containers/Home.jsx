import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import "./Home.css";
import NavBarComponent from '../components/NavBarComponent';
import Dasboard from './Dashboard';
var bcrypt = require('bcryptjs');

export default class Home extends React.Component {
    state = {
        errorPopup: false,
        errorMessage: ""
    };

    handleLogin = (username, password) => {
        if (!this.validateEmail(username)) {
            if (this.validateFirebaseUser(username, password)) {
                this.props.login();
                this.props.history.push('/dashboard');
            } else {
                this.setState({
                    errorMessage: "Invalid username/password.",
                    errorPopup: true
                })
            }
        } else {
            this.props.firebase.auth().signInWithEmailAndPassword(username, password).then(result => {
                this.props.login();
                this.props.history.push('/dashboard');
            }).catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({ 
                    errorPopup: true,
                    errorMessage: "Invalid username/password."
                });
                
            });
        }
    }

    toggleErrorPopup = () => {
        this.setState({
            errorPopup: !this.state.errorPopup
        });
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateFirebaseUser = (username, password) => {
        for (var user in this.props.users){
            if (user === username && bcrypt.compareSync(password, this.props.users[user].hash)){
                return true;
            }
        }
        return false;
    }

    render () {

        const errorModal = 
        <Modal isOpen={this.state.errorPopup} toggle={this.toggleErrorPopup}>
            <ModalHeader toggle={this.toggleErrorPopup}>Invalid username/password</ModalHeader>
            <ModalBody>
                {this.state.errorMessage} <br/>Please try again or click here to reset password
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleErrorPopup}>Close</Button>
            </ModalFooter>
        </Modal>;
        return (
            <div>
                <div className="logincomponent">
                    <Col sm={4}>
                        <LoginComponent handleLogin={this.handleLogin} />
                    </Col>
                </div>
                {errorModal}
            </div>

        );
    }
}
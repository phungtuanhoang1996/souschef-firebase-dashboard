import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import "./Home.css";
import firebase from 'firebase'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreators";
var bcrypt = require('bcryptjs');
import { withRouter } from 'react-router-dom'
import logger from '../Utils/logger'

class Home extends React.Component {
    state = {
        errorPopup: false,
        errorMessage: ""
    };

    handleLogin = (username, password) => {
        if (!this.validateEmail(username)) {
            const currentUserObject = this.validateFirebaseUser(username, password);
            if (currentUserObject != false) {
	            this.props.login(result.email, user.uid, null, null);
                this.props.history.push('/dashboard');
            } else {
                this.setState({
                    errorMessage: "Invalid username/password.",
                    errorPopup: true
                })
            }
        } else {
            firebase.auth().signInWithEmailAndPassword(username, password).then(result => {
                console.log("Firebase login result:")
                console.log(result)
                var user = firebase.auth().currentUser
                this.props.login(result.email, user.uid, null, null);
                this.props.history.push('/dashboard');
            }, error => {
                var errorMessage = error.message;
                logger("Login error:", errorMessage)
                this.setState({
                    errorPopup: true,
                    errorMessage: errorMessage
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
                return this.props.users[user];
            }
        }
        return false;
    }

    render () {

        const errorModal = 
        <Modal isOpen={this.state.errorPopup} toggle={this.toggleErrorPopup}>
            <ModalHeader toggle={this.toggleErrorPopup}>Login Error</ModalHeader>
            <ModalBody>
                {this.state.errorMessage}
                <br/>
                {this.state.errorMessage === "Invalid username/password." ? 'Please try again or click here to reset password' :  null}
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

    componentDidMount() {
        if (this.props.isLoggedIn) {
	        this.props.history.push('/dashboard');
        }
    }
}

function mapStateToProps (state) {
	return {
		isLoggedIn: state.isLoggedIn,
		authToken: state.authToken,
		currentUser: state.currentUser,
		currentUserUid: state.currentUserUid,
		currentBrandName: state.currentBrandName,
		currentBrandId: state.currentBrandId
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
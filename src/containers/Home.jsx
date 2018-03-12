import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import "./Home.css";
import NavBarComponent from '../components/NavBarComponent';
import Dasboard from './Dashboard';

export default class Home extends React.Component {
    state = {
        errorPopup: false,
    };

    handleLogin = (email, password) => {
        this.props.firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
            this.props.login();
            this.props.history.push('/dashboard');
        }).catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({ errorPopup: true });
            
        });
    }

    toggleErrorPopup = () => {
        this.setState({
            errorPopup: !this.state.errorPopup
        });
    }

    render () {

        const errorModal = 
        <Modal isOpen={this.state.errorPopup} toggle={this.toggleErrorPopup}>
            <ModalHeader toggle={this.toggleErrorPopup}>Invalid username/password</ModalHeader>
            <ModalBody>
                The username/password is incorrect. Please try again or click here to reset password
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
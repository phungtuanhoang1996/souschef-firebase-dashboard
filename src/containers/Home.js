import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import {Button} from 'reactstrap';
import "./Home.css";
import firebase from 'firebase';
import {FireabaseDatabase} from '../firebase';

export default class HomeComponent extends React.Component {
    state = {
        isLoggedIn: false
    };

    handleLogin = () => {
        console.log('clicked');
        this.setState({isLoggedIn: true});
    }

    handleClick = (email, password) => {
        email = "souschefsoftware@gmail.com";
        password = "Souschef2017"

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }

    render () {
        return (
            <div>
                <Button onClick={() => this.handleLogin()}>
                    test
                </Button>
                {
                    this.state.isLoggedIn ? 
                        <div>logged in</div>:
                        <div className="logincomponent" >
                            <LoginComponent className="logincomponent" handleLogin={this.handleLogin} />
                        </div>
                        
                }

            </div>

        );
    }
}
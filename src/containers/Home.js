import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import "../styles/Home.css";

export default class HomeComponent extends React.Component {
    render () {
        return (
            <div className="wrapper">
                <div className="LoginComponent">
                    <LoginComponent />
                </div>
            </div>
        );
    }
}
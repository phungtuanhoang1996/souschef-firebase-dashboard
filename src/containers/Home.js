import React from 'react';
import  LoginComponent  from '../components/LoginComponent';
import "./Home.css";

export default class HomeComponent extends React.Component {
    render () {
        return (
            <div className="logincomponent">
                <LoginComponent className="logincomponent"/>
            </div>
        );
    }
}
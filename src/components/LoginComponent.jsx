import React from 'react';
import { Input, Button } from 'semantic-ui-react'

export default class LoginComponent extends React.Component {
    state = {
        email: "",
        password: ""
    }

    emailHandler = (event) => {
        this.setState({ email: event.target.value })
    }

    passwordHandler = (event) => {
        this.setState({password: event.target.value})
    }

    handleClick = () => {
        this.props.handleLogin(this.state.email, this.state.password);
    }

    render () {
        return (
            <div>
                <h2 align='center'>Souschef Dashboard</h2>
                <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <Input onChange={this.emailHandler} style={{width: '100%'}} placeholder={'Username...'}>
                    </Input>
                </div>
	            <div style={{paddingTop: '5px', paddingBottom: '5px'}}>
                    <Input type='password' onChange={this.passwordHandler} style={{width: '100%'}} placeholder={'Password...'}>
                    </Input>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5px', paddingBottom: '5px'}}>
                    <Button color='teal' onClick={this.handleClick}>Login</Button>
                </div>
            </div>
        );
    }
}
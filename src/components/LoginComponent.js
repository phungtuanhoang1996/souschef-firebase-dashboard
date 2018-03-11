import React from 'react';
import { Form, FormGroup, Label, Input, Button, Col } from 'reactstrap';

export default class LoginComponent extends React.Component {
    state = {
        email: "",
        password: ""
    }

    emailHandler = (event) => {
        console.log(event.target.value);
        this.setState({ email: event.target.value })
    }

    passwordHandler = (event) => {
        this.setState({password: event.target.value})
    }

    render () {
        return (
            <Form>
                <FormGroup row>
                    <Label for="emailInput" sm={2}>Email</Label>
                    <Col sm={9}>
                        <Input id="emailInput" type="email" name="email" placeholder="Enter email" onChange={this.emailHandler}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="passwordInput" sm={2}>Password</Label>
                    <Col sm={9}>
                        <Input id="passwordInput" type="password" name="password" placeholder="Enter password" onChange={this.passwordHandler}/>
                    </Col>
                    <Col sm={1}>
                        <Button onClick={this.props.handleLogin}>Log In</Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}
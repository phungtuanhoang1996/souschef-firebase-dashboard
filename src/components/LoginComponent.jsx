import React from 'react';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Col } from 'reactstrap';

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
                <Card>
                    <CardBody>
                        <Form>
                            <FormGroup>
                                <Label for="usernameInput">Username</Label>
                                    <Input id="usernameInput" type="text" name="text" placeholder="Username/email" onChange={this.emailHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="passwordInput">Password</Label>
                                    <Input id="passwordInput" type="password" name="password" placeholder="Enter password" onChange={this.passwordHandler} />
                            </FormGroup>
                        </Form>
                        <Button className="float-right" type='submit' onClick={(event) => this.handleClick(event)}>Log in</Button>
                    </CardBody>
                </Card>
            </div>

        );
    }
}
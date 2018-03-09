import React from 'react';
import { Router ,Route, IndexRoute } from 'react-router-dom';
import { HomeComponent as Home } from './components/HomeComponent';

export default class Routes extends React.Component{
    render() {
        return (
            <Router>
                <Route path="/" component={Main}>
                    <IndexRoute component={HelloWorld} />
                    <Route path="about" component={About} />
                </Route>
            </Router>
        );
    }
}
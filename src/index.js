import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';

ReactDOM.render( 
    <Provider store={store}>
        <Router>
            <Route path="/" component={Home}/>
        </Router>
    </Provider>
, document.getElementById('root'));
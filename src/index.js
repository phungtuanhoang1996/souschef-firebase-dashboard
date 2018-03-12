import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './containers/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';
import App, {NavBar, DashboardPage} from './App';
import Dashboard from './containers/Dashboard';
import NavBarComponent from './components/NavBarComponent';

ReactDOM.render( 
    <Provider store={store}>
        <Router>
            <div>
                <NavBar/>
                <Route path="/" exact component={App} />
                <Route path="/dashboard" component={DashboardPage} />
            </div>
        </Router>
    </Provider>
, document.getElementById('root'));
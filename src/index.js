import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import firebase from './firebase'

ReactDOM.render( 
    <Provider store={store}>
        <App/>
    </Provider>
, document.getElementById('root'));
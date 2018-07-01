import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import firebase from './firebase'
import './semantic/dist/semantic.min.css';

ReactDOM.render( 
    <Provider store={store}>
        <App/>
    </Provider>
, document.getElementById('root'));
import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers/index';
import firebase from './firebase';
import { reactReduxFirebase } from 'react-redux-firebase';

const defaultState = {
    authToken: "",
    isLoggedIn: false,
}

// react-redux-firebase options
const config = {
    machines: 'machines', // firebase root where user profiles are stored
    brands: 'brands',
    users: 'users',
    enableLogging: false, // enable/disable Firebase's database logging
  }

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, config)
)(createStore);

const store = createStoreWithFirebase(rootReducer, defaultState);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
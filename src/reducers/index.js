import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authToken from './authToken';
import isLoggedIn from './isLoggedIn';
import machines from './machines';
import brands from './brands';
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({authToken, brands, firebase : firebaseReducer, isLoggedIn, machines, routing: routerReducer});

export default rootReducer;
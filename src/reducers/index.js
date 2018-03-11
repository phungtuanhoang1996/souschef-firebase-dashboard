import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authToken from './authToken';
import isLoggedIn from './isLoggedIn';
import machines from './machines';
import brands from './brands';

const rootReducer = combineReducers({authToken, brands, isLoggedIn, machines, routing: routerReducer});

export default rootReducer;
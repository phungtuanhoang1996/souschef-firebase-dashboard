import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authToken from './authToken';

const rootReducer = combineReducers({authToken, routing: routerReducer});

export default rootReducer;
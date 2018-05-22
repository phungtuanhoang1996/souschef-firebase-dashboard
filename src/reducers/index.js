import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authToken from './authToken';
import isLoggedIn from './isLoggedIn';
import currentBrandName from './currentBrandName';
import currentBrandId from './currentBrandId';
import currentUserUid from './currentUserUid'
import currentUser from './currentUser';

const rootReducer = combineReducers({authToken, currentBrandName, currentBrandId, currentUser, currentUserUid, isLoggedIn, routing: routerReducer});

export default rootReducer;
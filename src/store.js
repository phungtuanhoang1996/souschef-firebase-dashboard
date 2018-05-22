import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers/index';

// const defaultState = {
//     authToken: "",
//     isLoggedIn: false,
//     currentUser: "",
//     currentBrandName: "",
//     currentBrandId: ""
// }

const defaultState = {
    authToken: "",
    isLoggedIn: false,
    currentUser: null,
    currentUserUid: null,
    currentBrandName: null,
    currentBrandId: null
}

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
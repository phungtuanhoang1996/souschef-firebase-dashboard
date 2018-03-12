import { createStore, compse } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers/index';
import firebase, { MachinesRef, BrandsRef } from './firebase';

const defaultState = {
    authToken: "",
    isLoggedIn: false,
    machines: [],
    brands: [],

}

MachinesRef.on("value", function (snapshot) {
    defaultState.machines = snapshot.val();
}, function (errorObject) {
});

BrandsRef.on("value", function (snapshot) {
    defaultState.brands = snapshot.val();
}, function (errorObject) {
});

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
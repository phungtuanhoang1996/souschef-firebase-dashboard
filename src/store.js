import { createStore } from 'redux';
import rootReducer from './reducers/index';

const defaultState = {
    authToken: "",
    isLoggedIn: false,
    currentUser: null,
    currentUserUid: null,
    currentBrandName: null,
    currentBrandId: null,
    currentEvent: null,
    currentDashboardPage: 'overview',
    codes: {},
    machinesData: {}
}

const store = createStore(rootReducer, defaultState);

export default store;
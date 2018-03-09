import { createStore, compse } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers/index';

const defaultState = {
    authToken: ""
}
const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
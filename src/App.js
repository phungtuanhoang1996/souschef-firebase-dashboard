import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import * as actionCreators from './actions/actionCreators';
import Home from './containers/Home';
import NavBarComponent from './components/NavBarComponent';
import Dashboard from './containers/Dashboard';

function mapStateToProps (state) {
    return {
        isLoggedIn: state.isLoggedIn,
        authToken: state.authToken,
	    currentUser: state.currentUser,
	    currentUserUid: state.currentUserUid,
	    currentBrandName: state.currentBrandName,
	    currentBrandId: state.currentBrandId
    }
}

function mapDispatchToProps (dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps);

export const NavBar = App(NavBarComponent);
export const DashboardPage = App(Dashboard);
export default App(Home);
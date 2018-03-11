import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from './actions/actionCreators';
import Home from './containers/Home';
import NavBarComponent from './components/NavBarComponent';

function mapStateToProps (state) {
    return {
        isLoggedIn: state.isLoggedIn,
        authToken: state.authToken,
        machines: state.machines,
        brands: state.brands
    }
}

function mapDispatchToProps (dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps);

export const NavBar = App(NavBarComponent);
export default App(Home);
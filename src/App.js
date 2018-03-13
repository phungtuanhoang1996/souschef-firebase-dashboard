import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import * as actionCreators from './actions/actionCreators';
import Home from './containers/Home';
import NavBarComponent from './components/NavBarComponent';
import Dashboard from './containers/Dashboard';

// function mapStateToProps (state) {
//     return {
//         isLoggedIn: state.isLoggedIn,
//         authToken: state.authToken,
//     }
// }

function mapDispatchToProps (dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

// const App = connect(mapStateToProps, mapDispatchToProps);

// Connects app with firebase, based on the nodes 'machines' and 'brands'
const App = compose(
    firebaseConnect((props) => {
      return [
        'machines',
        'brands',
        'users'
      ]
    }),
    connect(
      (state) => ({
        machines: state.firebase.data.machines,
        brands: state.firebase.data.brands,
        users: state.firebase.data.users,
        currentUser: state.currentUser,
        currentBrandName: state.currentBrandName,
        currentBrandId: state.currentBrandId,
        isLoggedIn: state.isLoggedIn,
        authToken: state.authToken,
      }),
      mapDispatchToProps
    )
  )

export const NavBar = App(NavBarComponent);
export const DashboardPage = App(Dashboard);
export default App(Home);
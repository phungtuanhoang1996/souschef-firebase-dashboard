import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import * as actionCreators from './actions/actionCreators';
import Home from './containers/Home';
import NavBarComponent from './components/NavBarComponent';

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
        'brands'
      ]
    }),
    connect(
      (state) => ({
        machines: state.firebase.data.machines,
        brands: state.firebase.data.brands,
        isLoggedIn: state.isLoggedIn,
        authToken: state.authToken,
      }),
      mapDispatchToProps
    )
  )

export const NavBar = App(NavBarComponent);
export default App(Home);
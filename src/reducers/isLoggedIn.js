function isLoggedIn(state = [], action) {
    console.log("test", state, action);
    if (action.isLoggedIn===true || action.isLoggedIn===false) {
        return action.isLoggedIn;
    } else {
        return state;
    }
}

export default isLoggedIn;
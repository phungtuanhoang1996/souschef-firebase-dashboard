function currentUser(state=[], action) {
    if (action.currentUser != null) {
        return action.currentUser;
    }
    return state;
}

export default currentUser;
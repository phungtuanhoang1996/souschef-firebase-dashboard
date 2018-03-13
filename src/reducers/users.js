function users(state = [], action) {
    console.log("users", state, action.data);
    if (action.data != null) {
        return action.data;
    } else {
        return state;
    }
}

export default users;
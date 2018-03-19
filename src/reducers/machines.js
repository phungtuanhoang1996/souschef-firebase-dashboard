function machines(state=[],action){
    if (action.data != null) {
        return action.data;
    } else {
        return state;
    }
}

export default machines;
function machines(state=[],action){
    console.log("machines", state, action.data);
    if (action.data != null) {
        return action.data;
    } else {
        return state;
    }
}

export default machines;
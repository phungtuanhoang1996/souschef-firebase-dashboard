function currentBrandName(state=[], action) {
    if (action.currentBrandName != null) {
        return action.currentBrandName;
    }
    return state;
}

export default currentBrandName;